import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Constants
const FINANCIAL_DATASETS_API_BASE = "https://api.financialdatasets.ai";

// Types
interface ApiResponse {
  Error?: string;
  [key: string]: unknown;
}

// Helper functions
function toTextContent(data: unknown): { content: TextContent[] } {
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2),
    }],
  };
}

const server = new McpServer({
  name: "financial-datasets",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

async function makeRequest(url: string): Promise<ApiResponse | null> {
  const headers: HeadersInit = {};
  if (process.env.FINANCIAL_DATASETS_API_KEY) {
    headers["X-API-KEY"] = process.env.FINANCIAL_DATASETS_API_KEY;
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}`, errorText);
      return { Error: `HTTP error! status: ${response.status}, ${errorText}` };
    }
    return await response.json();
  } catch (error) {
    console.error("Error making API request:", error);
    return { Error: (error as Error).message };
  }
}

// Tool definitions
server.tool(
  "get_income_statements",
  "Get income statements for a company.",
  {
    ticker: z.string().describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
    period: z.enum(["annual", "quarterly", "ttm"]).default("annual").describe("Period of the income statement"),
    limit: z.number().int().default(4).describe("Number of income statements to return"),
  },
  async ({ ticker, period, limit }: { ticker: string; period: "annual" | "quarterly" | "ttm"; limit: number }) => {
    const url = `${FINANCIAL_DATASETS_API_BASE}/financials/income-statements/?ticker=${ticker}&period=${period}&limit=${limit}`;
    const data = await makeRequest(url);
    if (!data || data.Error || !data.income_statements) {
      return toTextContent(data?.Error ?? "Unable to fetch income statements or no income statements found.");
    }
    return toTextContent(data.income_statements);
  }
);

server.tool(
  "get_balance_sheets",
  "Get balance sheets for a company.",
  {
    ticker: z.string().describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
    period: z.enum(["annual", "quarterly", "ttm"]).default("annual").describe("Period of the balance sheet"),
    limit: z.number().int().default(4).describe("Number of balance sheets to return"),
  },
  async ({ ticker, period, limit }: { ticker: string; period: "annual" | "quarterly" | "ttm"; limit: number }) => {
    const url = `${FINANCIAL_DATASETS_API_BASE}/financials/balance-sheets/?ticker=${ticker}&period=${period}&limit=${limit}`;
    const data = await makeRequest(url);
    if (!data || data.Error || !data.balance_sheets) {
      return toTextContent(data?.Error ?? "Unable to fetch balance sheets or no balance sheets found.");
    }
    return toTextContent(data.balance_sheets);
  }
);

server.tool(
  "get_cash_flow_statements",
  "Get cash flow statements for a company.",
  {
    ticker: z.string().describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
    period: z.enum(["annual", "quarterly", "ttm"]).default("annual").describe("Period of the cash flow statement"),
    limit: z.number().int().default(4).describe("Number of cash flow statements to return"),
  },
  async ({ ticker, period, limit }: { ticker: string; period: "annual" | "quarterly" | "ttm"; limit: number }) => {
    const url = `${FINANCIAL_DATASETS_API_BASE}/financials/cash-flow-statements/?ticker=${ticker}&period=${period}&limit=${limit}`;
    const data = await makeRequest(url);
    if (!data || data.Error || !data.cash_flow_statements) {
      return toTextContent(data?.Error ?? "Unable to fetch cash flow statements or no cash flow statements found.");
    }
    return toTextContent(data.cash_flow_statements);
  }
);

server.tool(
  "get_current_stock_price",
  "Get the current / latest price of a company.",
  {
    ticker: z.string().describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
  },
  async ({ ticker }: { ticker: string }) => {
    const url = `${FINANCIAL_DATASETS_API_BASE}/prices/snapshot/?ticker=${ticker}`;
    const data = await makeRequest(url);
    if (!data || data.Error || !data.snapshot) {
      return toTextContent(data?.Error ?? "Unable to fetch current price or no current price found.");
    }
    return toTextContent(data.snapshot);
  }
);

server.tool(
  "get_historical_stock_prices",
  "Gets historical stock prices for a company.",
  {
    ticker: z.string().describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
    start_date: z.string().describe("Start date of the price data (e.g. 2020-01-01)"),
    end_date: z.string().describe("End date of the price data (e.g. 2020-12-31)"),
    interval: z.enum(["minute", "hour", "day", "week", "month"]).default("day").describe("Interval of the price data"),
    interval_multiplier: z.number().int().default(1).describe("Multiplier of the interval"),
  },
  async ({ ticker, start_date, end_date, interval, interval_multiplier }: {
    ticker: string;
    start_date: string;
    end_date: string;
    interval: "minute" | "hour" | "day" | "week" | "month";
    interval_multiplier: number;
  }) => {
    const url = `${FINANCIAL_DATASETS_API_BASE}/prices/?ticker=${ticker}&interval=${interval}&interval_multiplier=${interval_multiplier}&start_date=${start_date}&end_date=${end_date}`;
    const data = await makeRequest(url);
    if (!data || data.Error || !data.prices) {
      return toTextContent(data?.Error ?? "Unable to fetch prices or no prices found.");
    }
    return toTextContent(data.prices);
  }
);

server.tool(
  "get_company_news",
  "Get news for a company.",
  {
    ticker: z.string().describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
  },
  async ({ ticker }: { ticker: string }) => {
    const url = `${FINANCIAL_DATASETS_API_BASE}/news/?ticker=${ticker}`;
    const data = await makeRequest(url);
    if (!data || data.Error || !data.news) {
      return toTextContent(data?.Error ?? "Unable to fetch news or no news found.");
    }
    return toTextContent(data.news);
  }
);

server.tool(
  "get_available_crypto_tickers",
  "Gets all available crypto tickers.",
  {},
  async () => {
    const url = `${FINANCIAL_DATASETS_API_BASE}/crypto/prices/tickers`;
    const data = await makeRequest(url);
    if (!data || data.Error || !data.tickers) {
      return toTextContent(data?.Error ?? "Unable to fetch available crypto tickers or no available crypto tickers found.");
    }
    return toTextContent(data.tickers);
  }
);

server.tool(
  "get_historical_crypto_prices",
  "Gets historical prices for a crypto currency.",
  {
    ticker: z.string().describe("Ticker symbol of the crypto currency (e.g. BTC-USD)"),
    start_date: z.string().describe("Start date of the price data (e.g. 2020-01-01)"),
    end_date: z.string().describe("End date of the price data (e.g. 2020-12-31)"),
    interval: z.enum(["minute", "hour", "day", "week", "month"]).default("day").describe("Interval of the price data"),
    interval_multiplier: z.number().int().default(1).describe("Multiplier of the interval"),
  },
  async ({ ticker, start_date, end_date, interval, interval_multiplier }: {
    ticker: string;
    start_date: string;
    end_date: string;
    interval: "minute" | "hour" | "day" | "week" | "month";
    interval_multiplier: number;
  }) => {
    const url = `${FINANCIAL_DATASETS_API_BASE}/crypto/prices/?ticker=${ticker}&interval=${interval}&interval_multiplier=${interval_multiplier}&start_date=${start_date}&end_date=${end_date}`;
    const data = await makeRequest(url);
    if (!data || data.Error || !data.prices) {
      return toTextContent(data?.Error ?? "Unable to fetch prices or no prices found.");
    }
    return toTextContent(data.prices);
  }
);

server.tool(
  "get_current_crypto_price",
  "Get the current / latest price of a crypto currency.",
  {
    ticker: z.string().describe("Ticker symbol of the crypto currency (e.g. BTC-USD)"),
  },
  async ({ ticker }: { ticker: string }) => {
    const url = `${FINANCIAL_DATASETS_API_BASE}/crypto/prices/snapshot/?ticker=${ticker}`;
    const data = await makeRequest(url);
    if (!data || data.Error || !data.snapshot) {
      return toTextContent(data?.Error ?? "Unable to fetch current price or no current price found.");
    }
    return toTextContent(data.snapshot);
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Financial Datasets MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Error running server:", error);
  process.exit(1);
});
