import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { connectToMCPServer } from "./app/helpers/mcp";
import Exa from "exa-js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import path from "path";

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
  fetchTools: () => Promise<RunnableFunction[]>;
};

export const serverConfig: ServerConfig = {
  systemPrompt: `
  You are a UI engine for a marketing analytics dashboard. Given the user's prompt, generate a component appropriate to be displayed
  in an analytics dashboard. Use visualizations and charts to answer the user's question and make data easy to understand as much as possible.

  Use the webSearch tool to:
  - Search the web for information related to the data and suggest follow up questions that may be helpful to the user.
  - Use web search to answer questions that other tools may not be sufficient for.
  - Use web search to attach helpful context to the data. For example, if a stock price fell, use web search to find out plausible contributing factors.


  Current date: ${new Date().toISOString()}
  `,

  fetchTools: async (): Promise<RunnableFunction[]> => {
    const mcpClient = await fetchMcpClient();
    const availableTools = await mcpClient?.listTools();
    if (!availableTools?.tools) return [];

    const mcpTools = availableTools.tools.map((tool) => ({
      type: "function" as const,
      function: {
        name: tool.name,
        description: tool.description || "",
        parameters: tool.inputSchema as Record<string, object>,
        function: async (args: string) => {
          if (!mcpClient) {
            return JSON.stringify({
              error: "mcpClient not available",
            });
          }
          try {
            const parsedArgs = JSON.parse(args);
            const result = await mcpClient.callTool({
              name: tool.name,
              arguments: parsedArgs,
            });
            return JSON.stringify(result);
          } catch (error) {
            console.error(`error calling tool ${tool.name}: `, error);
            return `Error calling tool ${tool.name}`;
          }
        },
      },
    }));

    const otherTools = [
      {
        type: "function" as const,
        function: {
          name: "webSearch",
          description: "Search the web for the latest information",
          parameters: zodToJsonSchema(webSearchSchema),
          function: async (query: string) => {
            const results = await exa.answer(query);
            return JSON.stringify(results);
          },
        },
      },
    ];

    return [...mcpTools, ...otherTools];
  },
};

const exa = new Exa(process.env.EXA_API_KEY);

const webSearchSchema = z.object({
  query: z.string(),
});

const fetchMcpClient = async (): Promise<Client | undefined> => {
  // Use absolute path to the MCP server directory
  const mcpDir = path.resolve(process.cwd(), "financial-datasets-mcp");
  const mcpClient = await connectToMCPServer("uv", [
    "--directory",
    mcpDir,
    "run",
    "server.py",
  ]);
  return mcpClient;
};
