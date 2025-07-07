import OpenAI from "openai";

export type DBMessage = OpenAI.Chat.ChatCompletionMessageParam & {
  id?: string;
};

const messages: DBMessage[] = [];

export const getMessageStore = () => {
  return {
    addMessage: (message: DBMessage) => {
      messages.push(message);
    },
    messages,
    getOpenAICompatibleMessageList: () => {
      return messages.map((m) => {
        const message = {
          ...m,
        };

        delete message.id;

        return message;
      });
    },
  };
};
