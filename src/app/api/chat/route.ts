import { NextRequest } from "next/server";
import OpenAI from "openai";
import { addMessages, getLLMThreadMessages } from "@/services/threadService";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { serverConfig } from "@/config.server";
import { makeC1Response } from "@thesysai/genui-sdk/server";

type ThreadId = string;

export async function POST(req: NextRequest) {
  const c1Response = makeC1Response();
  c1Response.writeThinkItem({
    title: "Analyzing Prompt",
    description: "Interpreting your query and querying the datasets",
  });

  const { prompt, threadId, responseId } = (await req.json()) as {
    prompt: {
      role: "user";
      content: string;
      id: string;
    };
    threadId: ThreadId;
    responseId: string;
  };

  const client = new OpenAI({
    baseURL: "http://localhost:3102/v1/embed",
    apiKey: process.env.THESYS_API_KEY,
  });

  const tools = await serverConfig.fetchTools(c1Response.writeThinkItem);

  const runToolsResponse = client.beta.chat.completions.runTools({
    model: "c1/anthropic/claude-sonnet-4/v-20250617",
    messages: [
      {
        role: "system",
        content: serverConfig.systemPrompt,
      },
      ...(await getLLMThreadMessages(threadId)),
      {
        role: "user",
        content: prompt.content!,
      },
    ],
    stream: true,
    tools: tools ?? [],
  });

  const allRunToolsMessages: ChatCompletionMessageParam[] = [];
  let isError = false;

  runToolsResponse.on("error", () => {
    isError = true;
  });

  runToolsResponse.on("content", c1Response.writeContent);

  runToolsResponse.on("message", (message) => {
    allRunToolsMessages.push(message);
  });

  runToolsResponse.on("end", async () => {
    c1Response.end();
    // store messages on end only if there is no error
    if (isError) {
      return;
    }

    const runToolsMessagesWithId = allRunToolsMessages.map((m, index) => {
      const id =
        allRunToolsMessages.length - 1 === index // for last message (the response shown to user), use the responseId as provided by the UI
          ? responseId
          : crypto.randomUUID();

      return {
        ...m,
        id,
      };
    });

    const messagesToStore = [prompt, ...runToolsMessagesWithId];

    await addMessages(threadId, ...messagesToStore);
  });

  return new Response(c1Response.responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
