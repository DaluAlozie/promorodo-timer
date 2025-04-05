import BackgroundAudioPlayer from "@/components/BackgrounAudioPlayer/BackgrounAudioPlayer";
import Timer from "@/components/Timer/Timer";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="h-full min-h-max w-screen overflow-hidden bg-gray-300">
      <Toaster containerClassName="text-3xl h-16 overflow-hidden leading-[20px]" />
      <div className="flex h-full min-h-max w-full min-w-max flex-col items-center justify-center">
        <Timer />
      </div>
      <BackgroundAudioPlayer />
    </div>
  );
}
