import Exa from "exa-js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getFinancialTools } from "./app/tools/financial";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RunnableFunction = any;

type ServerConfig = {
  /**
   *  The system prompt to configure the behaviour and tone of the model.
   */
  systemPrompt: string;
  /**
   * Returns the tools that are available to the model.
   */
  fetchTools: (
    writeThinkingState: (item: { title: string; description: string }) => void
  ) => Promise<RunnableFunction[]>;
};

export const serverConfig: ServerConfig = {
  systemPrompt: `
  You are a UI engine for a marketing analytics dashboard. Given the user's prompt, generate a component appropriate to be displayed
  in an analytics dashboard. Use visualizations and charts to answer the user's question and make data easy to understand as much as possible.

  Do not show follow ups in the response.

  Use the webSearch tool to:
  - Search the web for information related to the data and suggest follow up questions that may be helpful to the user.
  - Use web search to answer questions that other tools may not be sufficient for.
  - Use web search to attach helpful context to the data. For example, if a stock price fell, use web search to find out plausible contributing factors.

  Current date: ${new Date().toISOString()}
  `,

  fetchTools: async (writeThinkingState): Promise<RunnableFunction[]> => {
    const financialTools = getFinancialTools(writeThinkingState);
    const otherTools = [
      {
        type: "function" as const,
        function: {
          name: "webSearch",
          description: "Search the web for the latest information",
          parameters: zodToJsonSchema(webSearchSchema),
          function: async (query: string) => {
            writeThinkingState({
              title: "Searching the web",
              description: "Collecting live insights for broader context",
            });
            const results = await exa.answer(query);
            const modifiedResults = JSON.stringify({
              answer: results.answer,
              citations: results.citations.map(({ text }) => ({ text })),
            });
            return modifiedResults;
          },
        },
      },
    ];

    return [...financialTools, ...otherTools];
  },
};

const exa = new Exa(process.env.EXA_API_KEY);

const webSearchSchema = z.object({
  query: z.string(),
});
