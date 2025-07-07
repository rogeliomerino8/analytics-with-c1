import { useThreadState, MessageProvider, Message, useThreadListActions } from "@crayonai/react-core";
import { RenderMessage } from "@crayonai/react-ui/CopilotShell";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { MessageLoader } from "./MessageLoader";
import { WelcomeCard } from "./ResponseCard";
import Header from "../Header";
import { Composer } from "./Composer";
import "../../custom.css";

export const Messages = ({ className }: { className?: string }) => {
  const { messages } = useThreadState();
  const { switchToNewThread } = useThreadListActions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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
    if (groupedMessages.length > 0) {
      setCurrentIndex(groupedMessages.length - 1);
    }
  }, [groupedMessages.length]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.parentElement?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const goToNext = () => {
    if (currentIndex < groupedMessages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="crayon-copilot-shell-thread-scroll-area flex flex-col h-full w-full">
      {/* Fixed top navigation bar */}
      <div
        className="w-full"
        style={{
          position: "absolute",
          top: "0px",
          left: "auto",
          right: "0px",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: "0px",
          padding: "0px 12px 0px 12px",
          zIndex: 1000,
          backdropFilter: "blur(8px)",
          background: "rgba(255, 255, 255, 0.95)",
          transition:
            "height 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease",
          height: "auto",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.0)",
        }}
      >
        <Header
          switchToNewThread={switchToNewThread}
          canGoToNext={currentIndex < groupedMessages.length - 1}
          goToNext={goToNext}
          canGoToPrevious={currentIndex > 1}
          goToPrevious={goToPrevious}
        />
      </div>

      <div
        ref={messagesContainerRef}
        className={clsx(
          "crayon-copilot-shell-thread-messages flex-1",
          className
        )}
        style={{
          minHeight: "400px",
          overflow: "hidden",
        }}
      >
        {/* Message groups container */}
        <div
          style={{
            display: "flex",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            width: "100%",
            maxHeight: "100%",
            alignItems: "flex-start",
          }}
        >
          {groupedMessages.length == 0 ? <WelcomeCard /> : null}
          {groupedMessages.map((messageGroup, i) => (
            <div
              key={i}
              className="c1-chat-test-message-group h-full"
              style={{
                width: "100%",
                flexShrink: 0,
                backgroundColor: "white",
                minHeight: "400px",
                overflow: "auto",
                maxHeight: "calc(100vh - 80px)",
              }}
            >
              {!messageGroup.userMessage.isVisuallyHidden && (
                <MessageProvider
                  key={messageGroup.userMessage.id}
                  message={messageGroup.userMessage}
                >
                  <RenderMessage message={messageGroup.userMessage} />
                </MessageProvider>
              )}
              {messageGroup.assistantMessage ? (
                <>
                  <MessageProvider
                    key={messageGroup.assistantMessage.id}
                    message={messageGroup.assistantMessage}
                  >
                    <RenderMessage message={messageGroup.assistantMessage} />
                  </MessageProvider>
                </>
              ) : (
                <MessageLoader />
              )}
            </div>
          ))}
        </div>
      </div>
      <Composer />
    </div>
  );
};
