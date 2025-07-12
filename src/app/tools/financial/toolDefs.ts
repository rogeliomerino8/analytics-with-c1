import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Constants
const FINANCIAL_DATASETS_API_BASE = "https://api.financialdatasets.ai";

// Types
interface ApiResponse {
  Error?: string;
  income_statements?: unknown[];
  balance_sheets?: unknown[];
  cash_flow_statements?: unknown[];
  snapshot?: unknown;
  prices?: unknown[];
  news?: unknown[];
  tickers?: unknown[];
  [key: string]: unknown;
}

// Helper functions
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

// get_income_statements
export const getIncomeStatementsSchema = z.object({
  ticker: z
    .string()
    .describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
  period: z
    .enum(["annual", "quarterly", "ttm"])
    .default("annual")
    .describe("Period of the income statement"),
  limit: z
    .number()
    .int()
    .default(4)
    .describe("Number of income statements to return"),
});

export async function get_income_statements({
  ticker,
  period,
  limit,
}: z.infer<typeof getIncomeStatementsSchema>) {
  const url = `${FINANCIAL_DATASETS_API_BASE}/financials/income-statements/?ticker=${ticker}&period=${period}&limit=${limit}`;
  const data = await makeRequest(url);
  if (!data || data.Error || !data.income_statements) {
    return (
      data?.Error ??
      "Unable to fetch income statements or no income statements found."
    );
  }
  return data.income_statements;
}

// get_balance_sheets
export const getBalanceSheetsSchema = z.object({
  ticker: z
    .string()
    .describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
  period: z
    .enum(["annual", "quarterly", "ttm"])
    .default("annual")
    .describe("Period of the balance sheet"),
  limit: z
    .number()
    .int()
    .default(4)
    .describe("Number of balance sheets to return"),
});

export async function get_balance_sheets({
  ticker,
  period,
  limit,
}: z.infer<typeof getBalanceSheetsSchema>) {
  const url = `${FINANCIAL_DATASETS_API_BASE}/financials/balance-sheets/?ticker=${ticker}&period=${period}&limit=${limit}`;
  const data = await makeRequest(url);
  if (!data || data.Error || !data.balance_sheets) {
    return (
      data?.Error ??
      "Unable to fetch balance sheets or no balance sheets found."
    );
  }
  return data.balance_sheets;
}

// get_cash_flow_statements
export const getCashFlowStatementsSchema = z.object({
  ticker: z
    .string()
    .describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
  period: z
    .enum(["annual", "quarterly", "ttm"])
    .default("annual")
    .describe("Period of the cash flow statement"),
  limit: z
    .number()
    .int()
    .default(4)
    .describe("Number of cash flow statements to return"),
});

export async function get_cash_flow_statements({
  ticker,
  period,
  limit,
}: z.infer<typeof getCashFlowStatementsSchema>) {
  const url = `${FINANCIAL_DATASETS_API_BASE}/financials/cash-flow-statements/?ticker=${ticker}&period=${period}&limit=${limit}`;
  const data = await makeRequest(url);
  if (!data || data.Error || !data.cash_flow_statements) {
    return (
      data?.Error ??
      "Unable to fetch cash flow statements or no cash flow statements found."
    );
  }
  return data.cash_flow_statements;
}

// get_current_stock_price
export const getCurrentStockPriceSchema = z.object({
  ticker: z
    .string()
    .describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
});

export async function get_current_stock_price({
  ticker,
}: z.infer<typeof getCurrentStockPriceSchema>) {
  const url = `${FINANCIAL_DATASETS_API_BASE}/prices/snapshot/?ticker=${ticker}`;
  const data = await makeRequest(url);
  if (!data || data.Error || !data.snapshot) {
    return (
      data?.Error ?? "Unable to fetch current price or no current price found."
    );
  }
  return data.snapshot;
}

// get_historical_stock_prices
export const getHistoricalStockPricesSchema = z.object({
  ticker: z
    .string()
    .describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
  start_date: z
    .string()
    .describe("Start date of the price data (e.g. 2020-01-01)"),
  end_date: z.string().describe("End date of the price data (e.g. 2020-12-31)"),
  interval: z
    .enum(["minute", "hour", "day", "week", "month"])
    .default("day")
    .describe("Interval of the price data"),
  interval_multiplier: z
    .number()
    .int()
    .default(1)
    .describe("Multiplier of the interval"),
});

export async function get_historical_stock_prices({
  ticker,
  start_date,
  end_date,
  interval,
  interval_multiplier,
}: z.infer<typeof getHistoricalStockPricesSchema>) {
  const url = `${FINANCIAL_DATASETS_API_BASE}/prices/?ticker=${ticker}&interval=${interval}&interval_multiplier=${interval_multiplier}&start_date=${start_date}&end_date=${end_date}`;
  const data = await makeRequest(url);
  if (!data || data.Error || !data.prices) {
    return data?.Error ?? "Unable to fetch prices or no prices found.";
  }
  return data.prices;
}

// get_company_news
export const getCompanyNewsSchema = z.object({
  ticker: z
    .string()
    .describe("Ticker symbol of the company (e.g. AAPL, GOOGL)"),
});

export async function get_company_news({
  ticker,
}: z.infer<typeof getCompanyNewsSchema>) {
  const url = `${FINANCIAL_DATASETS_API_BASE}/news/?ticker=${ticker}`;
  const data = await makeRequest(url);
  if (!data || data.Error || !data.news) {
    return data?.Error ?? "Unable to fetch news or no news found.";
  }
  return data.news;
}

// get_available_crypto_tickers
export const getAvailableCryptoTickersSchema = z.object({});

export async function get_available_crypto_tickers() {
  const url = `${FINANCIAL_DATASETS_API_BASE}/crypto/prices/tickers`;
  const data = await makeRequest(url);
  if (!data || data.Error || !data.tickers) {
    return (
      data?.Error ??
      "Unable to fetch available crypto tickers or no available crypto tickers found."
    );
  }
  return data.tickers;
}

// get_historical_crypto_prices
export const getHistoricalCryptoPricesSchema = z.object({
  ticker: z
    .string()
    .describe("Ticker symbol of the crypto currency (e.g. BTC-USD)"),
  start_date: z
    .string()
    .describe("Start date of the price data (e.g. 2020-01-01)"),
  end_date: z.string().describe("End date of the price data (e.g. 2020-12-31)"),
  interval: z
    .enum(["minute", "hour", "day", "week", "month"])
    .default("day")
    .describe("Interval of the price data"),
  interval_multiplier: z
    .number()
    .int()
    .default(1)
    .describe("Multiplier of the interval"),
});

export async function get_historical_crypto_prices({
  ticker,
  start_date,
  end_date,
  interval,
  interval_multiplier,
}: z.infer<typeof getHistoricalCryptoPricesSchema>) {
  const url = `${FINANCIAL_DATASETS_API_BASE}/crypto/prices/?ticker=${ticker}&interval=${interval}&interval_multiplier=${interval_multiplier}&start_date=${start_date}&end_date=${end_date}`;
  const data = await makeRequest(url);
  if (!data || data.Error || !data.prices) {
    return data?.Error ?? "Unable to fetch prices or no prices found.";
  }
  return data.prices;
}

// get_current_crypto_price
export const getCurrentCryptoPriceSchema = z.object({
  ticker: z
    .string()
    .describe("Ticker symbol of the crypto currency (e.g. BTC-USD)"),
});

export async function get_current_crypto_price({
  ticker,
}: z.infer<typeof getCurrentCryptoPriceSchema>) {
  const url = `${FINANCIAL_DATASETS_API_BASE}/crypto/prices/snapshot/?ticker=${ticker}`;
  const data = await makeRequest(url);
  if (!data || data.Error || !data.snapshot) {
    return (
      data?.Error ?? "Unable to fetch current price or no current price found."
    );
  }
  return data.snapshot;
}

