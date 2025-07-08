import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { responseSchema } from "./responseSchema";
import { systemPrompt } from "./systemPrompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_KEY,
});

export const POST = async (req: Request) => {
  const { message } = await req.json();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: message }],
    stream: false,
  });

  const firstBlock = response.content[0];

  if (!firstBlock || firstBlock.type !== "text") {
    return NextResponse.json(
      { error: "Invalid response from model" },
      { status: 500 }
    );
  }

  let jsonToParse = firstBlock.text;

  if (firstBlock.text.startsWith("```json")) {
    jsonToParse = firstBlock.text.slice(7, -3);
  }

  const data = responseSchema.parse(JSON.parse(jsonToParse));

  return NextResponse.json(data);
};
