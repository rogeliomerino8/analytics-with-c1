import { m } from "framer-motion";
import clsx from "clsx";
import Header from "../Header";
import { Composer } from "../Composer";
import { useThreadState, type Message } from "@crayonai/react-core";
import { WelcomeCard } from "../WelcomeCard";
import { useEffect, useState } from "react";
import { MessageGroup } from "./MessageGroup";
import "@/custom.css";

export const CopilotTray = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { messages } = useThreadState();

  const groupedMessages: {
    userMessage: Message;
    assistantMessage?: Message;
  }[] = [];

  for (let i = 0; i < messages.length; i += 2) {
    const messageGroup = {
      userMessage: messages[i],
      assistantMessage: messages[i + 1],
    };
    groupedMessages.push(messageGroup);
  }

  // Update current index when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setCurrentMessageIndex(groupedMessages.length - 1);
    }
  }, [groupedMessages.length, messages.length]);

  const currentMessageGroup = groupedMessages[currentMessageIndex];

  return (
    <m.div
      className={clsx(
        "w-4/12 h-full max-h-full flex flex-col bg-container overflow-hidden transition-all duration-300",
        groupedMessages.length === 0 &&
          "border-l border-default border-l-black/4",
        groupedMessages.length > 0 && "w-8/12"
      )}
    >
      <Header
        canGoToNext={
          groupedMessages.length > 0 &&
          currentMessageIndex < groupedMessages.length - 1
        }
        goToNext={() => setCurrentMessageIndex((curr) => curr + 1)}
        canGoToPrevious={groupedMessages.length > 0 && currentMessageIndex > 0}
        goToPrevious={() => setCurrentMessageIndex((curr) => curr - 1)}
      />

      {groupedMessages.length === 0 ? (
        <WelcomeCard />
      ) : (
        <div className="flex-1 min-h-0 overflow-auto px-m py-l flex flex-col gap-xl pb-[108px]">
          <MessageGroup
            userMessage={currentMessageGroup?.userMessage as Message}
            assistantMessage={currentMessageGroup?.assistantMessage as Message}
          />
        </div>
      )}

      <div className="p-m bg-none">
        <Composer />
      </div>
    </m.div>
  );
};
