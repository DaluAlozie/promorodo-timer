export enum BackgrounAudio {
  CALMING_RAIN = "calming-rain",
  TRAFFIC_RAIN = "traffic-rain",
  AUTUMN_RAIN = "autumn-rain",
  JUNGLE_RAIN = "jungle-rain",
  LIGHT_RAIN = "light-rain",
  METAL_RAIN = "metal-rain",
  UMBRELLA_RAIN = "umbrella-rain",
  WINDOW_RAIN = "window-rain",

  // Fire Sounds
  FIREPLACE = "fireplace",
  BURNING = "burning",
  WILDFIRE = "wildfire",

  // Water Sounds
  HEAVY_STREAM = "heavy-stream",
  LIGHT_STREAM = "light-stream",
  WAVES = "waves",

  // Noise
  WHITE_NOISE = "white-noise",
  BROWN_NOISE = "brown-noise",

  // Chatter
  BUSY_CROWD = "busy-crowd",
  STREET = "street",
  SUBWAY = "subway",

  // Nature
  JUNGLE = "jungle",
  FOREST = "forest",
  NIGHT = "night",

  NONE = "none",
}

const CHATTER = [
  BackgrounAudio.BUSY_CROWD,
  BackgrounAudio.STREET,
  BackgrounAudio.SUBWAY,
];

const FIRE = [
  BackgrounAudio.FIREPLACE,
  BackgrounAudio.BURNING,
  BackgrounAudio.WILDFIRE,
];

const WATER = [
  BackgrounAudio.HEAVY_STREAM,
  BackgrounAudio.LIGHT_STREAM,
  BackgrounAudio.WAVES,
];

const NATURE = [
  BackgrounAudio.JUNGLE,
  BackgrounAudio.FOREST,
  BackgrounAudio.NIGHT,
];

const RAIN = [
  BackgrounAudio.CALMING_RAIN,
  BackgrounAudio.TRAFFIC_RAIN,
  BackgrounAudio.AUTUMN_RAIN,
  BackgrounAudio.JUNGLE_RAIN,
  BackgrounAudio.LIGHT_RAIN,
  BackgrounAudio.METAL_RAIN,
  BackgrounAudio.UMBRELLA_RAIN,
  BackgrounAudio.WINDOW_RAIN,
];

const NOISE = [BackgrounAudio.WHITE_NOISE, BackgrounAudio.BROWN_NOISE];

const ALL = [...CHATTER, ...FIRE, ...WATER, ...RAIN, ...NOISE];

export { ALL, NOISE, RAIN, CHATTER, FIRE, WATER, NATURE };

export const audioLabelMap: Record<BackgrounAudio, string> = {
  [BackgrounAudio.CALMING_RAIN]: "Calming",
  [BackgrounAudio.TRAFFIC_RAIN]: "Traffic",
  [BackgrounAudio.AUTUMN_RAIN]: "Autumn",
  [BackgrounAudio.JUNGLE_RAIN]: "Jungle",
  [BackgrounAudio.LIGHT_RAIN]: "Light",
  [BackgrounAudio.METAL_RAIN]: "Metal",
  [BackgrounAudio.UMBRELLA_RAIN]: "Umbrella",
  [BackgrounAudio.WINDOW_RAIN]: "Window",

  // Fire Sounds
  [BackgrounAudio.FIREPLACE]: "Fireplace",
  [BackgrounAudio.BURNING]: "Burning",
  [BackgrounAudio.WILDFIRE]: "Wildfire",

  // Water Sounds
  [BackgrounAudio.HEAVY_STREAM]: "Heavy Stream",
  [BackgrounAudio.LIGHT_STREAM]: "Light Stream",
  [BackgrounAudio.WAVES]: "Waves",

  // Noise
  [BackgrounAudio.WHITE_NOISE]: "White Noise",
  [BackgrounAudio.BROWN_NOISE]: "Brown Noise",

  // Chatter
  [BackgrounAudio.BUSY_CROWD]: "Busy Crowd",
  [BackgrounAudio.STREET]: "Street",
  [BackgrounAudio.SUBWAY]: "Subway",
  [BackgrounAudio.JUNGLE]: "Jungle",
  [BackgrounAudio.FOREST]: "Forest",
  [BackgrounAudio.NIGHT]: "Night",

  [BackgrounAudio.NONE]: "none",
};
