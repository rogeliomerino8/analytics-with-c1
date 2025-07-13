import { Message, MessageProvider } from "@crayonai/react-core";
import { RenderMessage } from "@crayonai/react-ui/CopilotShell";
import { MessageLoader } from "../MessageLoader";

interface MessageGroupProps {
  queryTitle?: string;
  userMessage?: Message;
  assistantMessage?: Message;
}

export const MessageGroup = ({
  queryTitle,
  userMessage,
  assistantMessage,
}: MessageGroupProps) => {
  return (
    <div className="flex flex-col gap-l">
      {queryTitle ? (
        <div className="text-md text-primary">{queryTitle}</div>
      ) : (
        userMessage && (
          <div className="text-md text-primary">
            {userMessage.message as string}
          </div>
        )
      )}
      {assistantMessage ? (
        <MessageProvider message={assistantMessage}>
          <RenderMessage key={assistantMessage.id} message={assistantMessage} />
        </MessageProvider>
      ) : (
        <MessageLoader />
      )}
    </div>
  );
};
