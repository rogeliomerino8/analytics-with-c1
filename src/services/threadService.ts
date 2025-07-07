import { Thread } from "@crayonai/react-core";
import type { ChatCompletionMessageParam } from "openai/resources.mjs";
import { randomUUID } from "crypto";

// In-memory store
interface DbThread {
  id: string;
  name: string;
  createdAt: Date;
  messages: Message[];
}

const threadStore = new Map<string, DbThread>();

export type Message = ChatCompletionMessageParam & {
  id: string;
};

// Function 1: Create Thread
export const createThread = async (name: string): Promise<Thread> => {
  const newThread: DbThread = {
    id: randomUUID(),
    name,
    createdAt: new Date(),
    messages: [],
  };

  threadStore.set(newThread.id, newThread);

  return {
    threadId: newThread.id,
    title: newThread.name,
    createdAt: newThread.createdAt,
  };
};

export const getThreadList = async (): Promise<Thread[]> => {
  const threads = Array.from(threadStore.values());
  return threads.map((thread) => ({
    threadId: thread.id,
    title: thread.name,
    createdAt: thread.createdAt,
  }));
};

export const addMessages = async (threadId: string, ...messages: Message[]) => {
  const thread = threadStore.get(threadId);
  if (!thread) {
    // To mimic findUniqueOrThrow
    throw new Error(`Thread with id ${threadId} not found.`);
  }

  thread.messages.push(...messages);
};

export const getUIThreadMessages = async (
  threadId: string
): Promise<Message[]> => {
  const thread = threadStore.get(threadId);

  if (!thread) {
    // To mimic findUniqueOrThrow
    throw new Error(`Thread with id ${threadId} not found.`);
  }

  const messages = thread.messages ?? [];

  const uiMessages = messages.filter(
    (msg) =>
      !(
        msg.role === "tool" || // Exclude 'tool' role messages
        (msg.role === "assistant" && // Exclude 'assistant' role messages *if* they have tool_calls
          msg.tool_calls)
      )
  );

  return uiMessages;
};

export const getLLMThreadMessages = async (
  threadId: string
): Promise<ChatCompletionMessageParam[]> => {
  const thread = threadStore.get(threadId);

  if (!thread) {
    // To mimic findUniqueOrThrow
    throw new Error(`Thread with id ${threadId} not found.`);
  }

  const messages = thread.messages ?? [];

  const llmMessages = messages.map((msg) => {
    const temp: { id?: string } & ChatCompletionMessageParam = { ...msg };
    delete temp.id;
    return temp;
  });

  return llmMessages;
};

export const updateMessage = async (
  threadId: string,
  updatedMessage: Message
): Promise<void> => {
  const thread = threadStore.get(threadId);

  if (!thread) {
    // To mimic findUniqueOrThrow
    throw new Error(`Thread with id ${threadId} not found.`);
  }

  const messages = thread.messages ?? [];

  const messageIndex = messages.findIndex(
    (msg) => msg.id === updatedMessage.id
  );

  if (messageIndex !== -1) {
    messages[messageIndex] = updatedMessage;
  } else {
    console.warn(
      `Message with id ${updatedMessage.id} not found in thread ${threadId}.`
    );
  }
};

export const deleteThread = async (threadId: string): Promise<void> => {
  threadStore.delete(threadId);
};

export const updateThread = async (thread: {
  threadId: string;
  name: string;
}): Promise<Thread> => {
  const existingThread = threadStore.get(thread.threadId);

  if (!existingThread) {
    throw new Error(`Thread with id ${thread.threadId} not found.`);
  }

  existingThread.name = thread.name;

  return {
    threadId: existingThread.id,
    title: existingThread.name,
    createdAt: existingThread.createdAt,
  };
};
