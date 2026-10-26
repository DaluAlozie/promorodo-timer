/* Seamless background audio looping with the Web Audio API.

   <audio loop> isn't sample-accurate and several of the clips have silence
   or fades baked into their edges, so each clip is decoded once, its quiet
   edges are skipped, and back-to-back copies are scheduled on the audio
   clock with an equal-power crossfade where they overlap. */

// Overlap between one copy of the clip and the next
const CROSSFADE_SECONDS = 1.5;
// Fade used when starting, stopping, pausing and resuming
const FADE_SECONDS = 0.3;
// Edges quieter than this fraction of the clip's typical loudness are
// skipped, which removes silence and baked-in fades
const EDGE_THRESHOLD = 0.7;
// Loudness is measured over windows of this length
const WINDOW_SECONDS = 0.05;
// Never skip more than this fraction of the clip from either end
const MAX_TRIM = 0.25;

type Session = {
  src: string;
  gain: GainNode;
  sources: Set<AudioBufferSourceNode>;
  stopped: boolean;
};

// Equal-power curves keep the combined loudness steady through a crossfade
const curve = (shape: (x: number) => number) => {
  const points = new Float32Array(64);
  for (let i = 0; i < points.length; i++) {
    points[i] = shape((i / (points.length - 1)) * (Math.PI / 2));
  }
  return points;
};
const FADE_IN = curve(Math.sin);
const FADE_OUT = curve(Math.cos);

// Start and end (in seconds) of the part of the clip at full loudness: from
// where its short-term loudness first reaches EDGE_THRESHOLD of the median
// to the last point it does
function audibleRange(buffer: AudioBuffer) {
  const size = Math.round(buffer.sampleRate * WINDOW_SECONDS);
  const count = Math.floor(buffer.length / size);
  const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) =>
    buffer.getChannelData(i),
  );
  const rms = new Float32Array(count);
  for (let w = 0; w < count; w++) {
    let sum = 0;
    for (const data of channels) {
      for (let i = w * size; i < (w + 1) * size; i++) sum += data[i] * data[i];
    }
    rms[w] = Math.sqrt(sum / (size * channels.length));
  }
  // Average neighbouring windows so a single loud spike in a fade is ignored
  const smooth = rms.map(
    (_, w) =>
      (rms[Math.max(w - 1, 0)] + rms[w] + rms[Math.min(w + 1, count - 1)]) / 3,
  );
  const median = [...smooth].sort((a, b) => a - b)[count >> 1] ?? 0;
  const threshold = median * EDGE_THRESHOLD;
  const maxTrim = Math.floor(count * MAX_TRIM);
  let start = 0;
  while (start < maxTrim && smooth[start] < threshold) start++;
  let end = count - 1;
  while (end > count - 1 - maxTrim && smooth[end] < threshold) end--;
  return {
    start: (start * size) / buffer.sampleRate,
    end: ((end + 1) * size) / buffer.sampleRate,
  };
}

class LoopPlayer {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private session: Session | null = null;
  private volume = 1;
  private paused = false;
  // Only the current clip is kept decoded, as each one is tens of MB
  private cached: { src: string; buffer: Promise<AudioBuffer> } | null = null;

  // Creates or resumes the audio context. Browsers only allow this during
  // a user gesture, so call it from a click handler.
  unlock() {
    if (!this.context) {
      // Safari mutes Web Audio with the ringer switch unless it's marked as
      // media playback, which <audio> elements are by default
      const { audioSession } = navigator as Navigator & {
        audioSession?: { type: string };
      };
      if (audioSession) audioSession.type = "playback";
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.paused ? 0 : this.volume;
      this.master.connect(this.context.destination);
    }
    // A context created during a click starts running, so muting before
    // the first play needs an explicit suspend
    if (this.paused) void this.context.suspend();
    else void this.context.resume();
  }

  setVolume(volume: number) {
    this.volume = volume;
    // While paused the new volume is applied on resume
    if (!this.context || !this.master || this.paused) return;
    this.master.gain.setTargetAtTime(volume, this.context.currentTime, 0.05);
  }

  async play(src: string) {
    if (this.session?.src === src && !this.session.stopped) return;
    this.stop();
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;

    const gain = context.createGain();
    gain.connect(master);
    const session: Session = { src, gain, sources: new Set(), stopped: false };
    this.session = session;

    let buffer: AudioBuffer;
    try {
      buffer = await this.decode(src);
    } catch (error) {
      console.error(error);
      return;
    }
    // A different track may have been picked while this one was loading
    if (session.stopped) return;

    const { start, end } = audibleRange(buffer);
    const length = end - start;
    const crossfade = Math.min(CROSSFADE_SECONDS, length / 4);

    // Plays one copy at `when`, fading in over `fadeIn` seconds and out over
    // the crossfade. When it ends the copy after next is scheduled, so there
    // is always one queued without relying on timers, which browsers
    // throttle in background tabs.
    const schedule = (when: number, fadeIn: number) => {
      if (session.stopped) return;
      const source = context.createBufferSource();
      source.buffer = buffer;
      const copyGain = context.createGain();
      copyGain.gain.setValueCurveAtTime(FADE_IN, when, fadeIn);
      copyGain.gain.setValueCurveAtTime(
        FADE_OUT,
        when + length - crossfade,
        crossfade,
      );
      source.connect(copyGain).connect(session.gain);
      source.start(when, start, length);
      session.sources.add(source);
      source.onended = () => {
        session.sources.delete(source);
        copyGain.disconnect();
        schedule(when + 2 * (length - crossfade), crossfade);
      };
    };

    const first = context.currentTime + 0.05;
    schedule(first, FADE_SECONDS);
    schedule(first + length - crossfade, crossfade);
  }

  // Fades out and drops the current track
  stop() {
    const session = this.session;
    this.session = null;
    if (!session || session.stopped) return;
    session.stopped = true;
    if (!this.context) return;
    const now = this.context.currentTime;
    session.gain.gain.setTargetAtTime(0, now, FADE_SECONDS / 3);
    session.sources.forEach((source) => {
      source.onended = null;
      source.stop(now + FADE_SECONDS);
    });
    setTimeout(() => session.gain.disconnect(), FADE_SECONDS * 1000 + 100);
  }

  // Fades out then suspends the audio clock, so resuming carries on from
  // exactly the same point in the loop
  pause() {
    this.paused = true;
    const context = this.context;
    if (!context || !this.master || context.state !== "running") return;
    this.master.gain.setTargetAtTime(0, context.currentTime, FADE_SECONDS / 3);
    setTimeout(() => {
      if (this.paused) void context.suspend();
    }, FADE_SECONDS * 1000);
  }

  resume() {
    this.paused = false;
    const context = this.context;
    if (!context || !this.master) return;
    void context.resume().then(() => {
      if (this.paused || !this.master) return;
      this.master.gain.setTargetAtTime(
        this.volume,
        context.currentTime,
        FADE_SECONDS / 3,
      );
    });
  }

  private decode(src: string) {
    if (this.cached?.src !== src) {
      const context = this.context!;
      const buffer = fetch(src)
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to load ${src}`);
          return response.arrayBuffer();
        })
        .then((data) => context.decodeAudioData(data));
      // Don't keep a failed load around, so it can be retried
      buffer.catch(() => {
        if (this.cached?.buffer === buffer) this.cached = null;
      });
      this.cached = { src, buffer };
    }
    return this.cached.buffer;
  }
}

export const backgroundLoop = new LoopPlayer();
