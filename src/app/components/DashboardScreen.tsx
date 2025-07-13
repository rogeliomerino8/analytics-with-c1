import { ChatProvider } from "@crayonai/react-core";
import { ErrorScreen } from "./ErrorScreen";
import { useThreadListManager, useThreadManager } from "@thesysai/genui-sdk";
import { usePathname, useRouter } from "next/navigation";
import * as apiClient from "@/apiClient";
import { CopilotTray } from "./CopilotTray";
import { useState } from "react";

export const DashboardScreen = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isError, setIsError] = useState(false);

  const threadListManager = useThreadListManager({
    fetchThreadList: () => apiClient.getThreadList(),
    deleteThread: (threadId) => apiClient.deleteThread(threadId),
    updateThread: (t) => apiClient.updateThread(t),
    onSwitchToNew: () => {
      replace(`${pathname}`);
    },
    onSelectThread: (threadId) => {
      const newSearch = `?threadId=${threadId}`;
      replace(`${pathname}${newSearch}`);
    },
    createThread: (message) => {
      return apiClient.createThread(message.message!);
    },
  });

  const threadManager = useThreadManager({
    threadListManager,
    loadThread: (threadId) => apiClient.getMessages(threadId),
    onUpdateMessage: ({ message }) => {
      apiClient.updateMessage(threadListManager.selectedThreadId!, message);
    },
    processMessage: async ({ messages, threadId, responseId }) => {
      const latestMessage = messages[messages.length - 1];
      let errorCount = 0;
      let delay = 2000; // start with 2 seconds

      while (errorCount < 3) {
        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
              prompt: latestMessage,
              threadId,
              responseId,
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to process message");
          }
          return response;
        } catch (error) {
          errorCount++;
          console.error(`Attempt ${errorCount} of 3 failed.`, error);
          if (errorCount < 3) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
          }
        }
      }
      setIsError(true);
      throw new Error("Failed to process message after multiple retries");
    },
  });

  if (isError) {
    return <ErrorScreen />;
  }

  return (
    <ChatProvider
      threadListManager={threadListManager}
      threadManager={threadManager}
    >
      <CopilotTray />
    </ChatProvider>
  );
};
