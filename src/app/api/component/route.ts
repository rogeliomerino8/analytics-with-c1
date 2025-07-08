import { NextRequest } from "next/server";
import OpenAI from "openai";
import { transformStream } from "@crayonai/stream";
import { getMessageStore } from "./messageStore";
import { config } from "@/app/config";

const client = new OpenAI({
  baseURL: "http://localhost:3102/v1/embed",
  apiKey: process.env.THESYS_API_KEY,
});

const messageStore = getMessageStore();

messageStore.addMessage({
  role: "system",
  content: config.systemPrompt,
});

export async function POST(req: NextRequest) {
  if (!req.body) {
    return new Response("No body provided", { status: 400 });
  }

  const { prompt } = (await req.json()) as {
    prompt: string;
  };

  if (!prompt) {
    return new Response("No prompt provided", { status: 400 });
  }

  messageStore.addMessage({
    role: "user",
    content: prompt,
  });

  const tools = await config.fetchTools?.();
  let llmResponse;

  if (tools) {
    llmResponse = client.beta.chat.completions.runTools({
      model: "c1-nightly",
      messages: messageStore.getOpenAICompatibleMessageList(),
      stream: true,
      tools,
    });

    llmResponse.on("message", (event) => messageStore.addMessage(event));
  } else {
    llmResponse = client.chat.completions.create({
      model: "c1-nightly",
      messages: messageStore.getOpenAICompatibleMessageList(),
      stream: true,
    });
  }

  const llmStream = await llmResponse;

  const responseStream = transformStream(
    llmStream,
    (chunk) => chunk.choices[0].delta.content,
    {
      onEnd: ({ accumulated }) => {
        if (!accumulated || tools) return;

        messageStore.addMessage({
          role: "assistant",
          content: accumulated.join(""),
        });
      },
    }
  ) as ReadableStream<string>;

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
