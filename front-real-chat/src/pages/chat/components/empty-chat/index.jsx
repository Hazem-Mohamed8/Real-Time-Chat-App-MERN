import { animationOption } from "@/lib/utils";
import Lottie from "react-lottie";

export default function EmptyChat() {
  return (
    <div className="flex-1 md:bg-[#1c1d24] md:flex flex-col justify-center items-center hidden duration-300">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationOption}
      />
      <div className="text-opacity-80 flex text-white flex-col gap-5 items-center mt-10 lg:text-4xl transition-all duration-300 text-3xl text-center ">
        <h3 className="poppins-medium">
          Hi<span className="text-purple-500">!</span> Welcome to
          <span className="text-purple-500"> Raghy</span> Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
}
