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

  // Extract JSON from the response, handling markdown and conversational text
  if (jsonToParse.includes("```json")) {
    jsonToParse = jsonToParse.split("```json")[1].split("```")[0].trim();
  } else {
    const jsonStartIndex = jsonToParse.indexOf("{");
    const jsonEndIndex = jsonToParse.lastIndexOf("}");
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      jsonToParse = jsonToParse.substring(jsonStartIndex, jsonEndIndex + 1);
    }
  }

  try {
    const data = responseSchema.parse(JSON.parse(jsonToParse));
    return NextResponse.json(data);
  } catch (e) {
    console.error("Error parsing related queries response", e);
    return NextResponse.json(
      { error: "Invalid response from model" },
      { status: 500 }
    );
  }
};
