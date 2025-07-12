import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  getIncomeStatementsSchema,
  getBalanceSheetsSchema,
  getCashFlowStatementsSchema,
  getCurrentStockPriceSchema,
  getHistoricalStockPricesSchema,
  getCompanyNewsSchema,
  getAvailableCryptoTickersSchema,
  getHistoricalCryptoPricesSchema,
  getCurrentCryptoPriceSchema,
  get_income_statements,
  get_balance_sheets,
  get_cash_flow_statements,
  get_current_stock_price,
  get_historical_stock_prices,
  get_company_news,
  get_available_crypto_tickers,
  get_historical_crypto_prices,
  get_current_crypto_price,
} from "./toolDefs";

export const getFinancialTools = (
  writeThinkingState: (item: { title: string; description: string }) => void
) => {
  let lastThinkingState: { title: string; description: string } | null = null;

  const createTool = <T extends z.ZodRawShape>(
    name: string,
    description: string,
    schema: z.ZodObject<T>,
    fn: (args: z.infer<z.ZodObject<T>>) => Promise<unknown>,
    thinkingState:
      | { title: string; description: string }
      | ((
          args: z.infer<z.ZodObject<T>>
        ) => { title: string; description: string })
  ) => ({
    type: "function" as const,
    function: {
      name,
      description,
      parameters: zodToJsonSchema(schema),
      function: async (args: string) => {
        try {
          const parsedArgs = JSON.parse(args);
          const state =
            typeof thinkingState === "function"
              ? thinkingState(parsedArgs)
              : thinkingState;
          if (JSON.stringify(state) !== JSON.stringify(lastThinkingState)) {
            writeThinkingState(state);
            lastThinkingState = state;
          }
          const result = await fn(parsedArgs);

          return JSON.stringify(result);
        } catch (error) {
          console.error(`error calling tool ${name}: `, error);
          return `Error calling tool ${name}`;
        }
      },
    },
  });

  return [
    createTool(
      "get_income_statements",
      "Get income statements for a company.",
      getIncomeStatementsSchema,
      get_income_statements,

      (args) => ({
        title: `Analyzing Income Statements for ${args.ticker}`,
        description:
          "Reviewing the company's profitability and financial performance.",
      })
    ),
    createTool(
      "get_balance_sheets",
      "Get balance sheets for a company.",
      getBalanceSheetsSchema,
      get_balance_sheets,

      (args) => ({
        title: `Examining Balance Sheets for ${args.ticker}`,
        description: "Assessing the company's assets, liabilities, and equity.",
      })
    ),
    createTool(
      "get_cash_flow_statements",
      "Get cash flow statements for a company.",
      getCashFlowStatementsSchema,
      get_cash_flow_statements,

      (args) => ({
        title: `Investigating Cash Flow for ${args.ticker}`,
        description: "Tracking the movement of cash within the business.",
      })
    ),
    createTool(
      "get_current_stock_price",
      "Get the current / latest price of a company.",
      getCurrentStockPriceSchema,
      get_current_stock_price,

      (args) => ({
        title: `Fetching Stock Price for ${args.ticker}`,
        description: "Getting the latest market price for the stock.",
      })
    ),
    createTool(
      "get_historical_stock_prices",
      "Gets historical stock prices for a company.",
      getHistoricalStockPricesSchema,
      get_historical_stock_prices,

      (args) => ({
        title: `Charting Historical Prices for ${args.ticker}`,
        description: "Plotting past stock performance to identify trends.",
      })
    ),
    createTool(
      "get_company_news",
      "Get news for a company.",
      getCompanyNewsSchema,
      get_company_news,

      (args) => ({
        title: `Scanning News for ${args.ticker}`,
        description: "Catching up on the latest news and announcements.",
      })
    ),
    createTool(
      "get_available_crypto_tickers",
      "Gets all available crypto tickers.",
      getAvailableCryptoTickersSchema,
      get_available_crypto_tickers,
      {
        title: "Surveying Crypto Markets",
        description: "Finding all available cryptocurrency tickers.",
      }
    ),
    createTool(
      "get_historical_crypto_prices",
      "Gets historical prices for a crypto currency.",
      getHistoricalCryptoPricesSchema,
      get_historical_crypto_prices,

      (args) => ({
        title: `Tracking Crypto History for ${args.ticker}`,
        description: "Analyzing historical price data for cryptocurrencies.",
      })
    ),
    createTool(
      "get_current_crypto_price",
      "Get the current / latest price of a crypto currency.",
      getCurrentCryptoPriceSchema,
      get_current_crypto_price,

      (args) => ({
        title: `Getting Crypto Price for ${args.ticker}`,
        description: "Fetching the current market value of the cryptocurrency.",
      })
    ),
  ];
};
