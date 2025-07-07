import React from "react";
import { ArrowRight } from "lucide-react";
import { useThreadActions } from "@crayonai/react-core";
import Image from "next/image";

export const WelcomeCard = () => {
  return (
    <div className="w-full h-full flex flex-col gap-[49px] items-center p-2xl">
      <Image
        src="/agent-logo.svg"
        alt="background"
        width={240}
        height={240}
        className="object-cover object-center max-w-full max-h-full"
      />
      <div className="flex flex-col gap-[16px] self-stretch">
        <WelcomeCardButton text="What was Apple's revenue and earnings per share last quarter?" />
        <WelcomeCardButton text="What is the latest news for Tesla?" />
        <WelcomeCardButton text="Show me Microsoft's latest quarterly earnings report." />
        <WelcomeCardButton text="Show me 3 stocks with revenue > 100B and net income > 10B" />
      </div>
    </div>
  );
};

const WelcomeCardButton = ({ text }: { text: string }) => {
  const { processMessage } = useThreadActions();

  const handleClick = () => {
    processMessage({
      type: "prompt",
      role: "user",
      message: text,
    });
  };

  return (
    <button
      className="flex items-center justify-between rounded-xl p-[16px] hover:bg-black/6 border border-interactive-el cursor-pointer"
      onClick={handleClick}
    >
      <span className="button-text text-left">{text}</span>
      <ArrowRight className="button-arrow" size={16} />
    </button>
  );
};
