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
    <div className="flex flex-col gap-s">
      {queryTitle ? (
        <div className="text-xl text-primary font-semibold">{queryTitle}</div>
      ) : (
        userMessage && (
          <div className="text-xl text-primary font-semibold break-all">
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
