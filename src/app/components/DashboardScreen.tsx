import { ChatProvider } from "@crayonai/react-core";
import {
  ThemeProvider,
  useThreadListManager,
  useThreadManager,
} from "@thesysai/genui-sdk";
import { usePathname, useRouter } from "next/navigation";
import * as apiClient from "@/apiClient";
import { CopilotShell } from "@crayonai/react-ui";
import { Messages } from "./Messages";

export const DashboardScreen = () => {
  const pathname = usePathname();
  const { replace } = useRouter();

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
    apiUrl: "/api/chat",
  });

  return (
    <ChatProvider
      threadListManager={threadListManager}
      threadManager={threadManager}
    >
      <ThemeProvider mode="light">
        <CopilotShell.Container
          logoUrl="https://crayonai.org/img/crayon-logo.svg"
          agentName="Analytics Copilot"
          className="c1-chat-test"
        >
          <CopilotShell.ThreadContainer>
            <Messages />
          </CopilotShell.ThreadContainer>
        </CopilotShell.Container>
      </ThemeProvider>
    </ChatProvider>
  );

  // return (
  //   <m.div
  //     className="flex flex-col h-screen max-h-screen w-1/3 border-l border-default border-l-black/4"
  //     initial={{ opacity: 0 }}
  //     animate={{ opacity: 1 }}
  //     transition={{ duration: 0.5, ease: "easeInOut" }}
  //   >
  //     <Header />
  //     <div className="flex-1 p-m flex flex-col">
  //       <div className="flex-1" />
  //       <Composer />
  //     </div>
  //   </m.div>
  // );
};
