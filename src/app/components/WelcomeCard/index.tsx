import React from "react";
import Image from "next/image";

export const WelcomeCard = () => {
  return (
    <div className="w-full h-full flex flex-col gap-[49px] items-center p-2xl justify-center">
      <Image
        src="/agent-image.svg"
        alt="background"
        width={346}
        height={346}
        className="object-cover object-center max-w-full max-h-full select-none mb-[40%]"
        draggable={false}
      />
    </div>
  );
};
