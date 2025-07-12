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

const createTool = <T extends z.ZodRawShape>(
  name: string,
  description: string,
  schema: z.ZodObject<T>,
  fn: (args: z.infer<z.ZodObject<T>>) => Promise<unknown>
) => ({
  type: "function" as const,
  function: {
    name,
    description,
    parameters: zodToJsonSchema(schema),
    function: async (args: string) => {
      try {
        const parsedArgs = JSON.parse(args);
        const result = await fn(parsedArgs);
        console.log(
          "called tool",
          name,
          "with args",
          parsedArgs,
          "result:",
          result
        );
        return JSON.stringify(result);
      } catch (error) {
        console.error(`error calling tool ${name}: `, error);
        return `Error calling tool ${name}`;
      }
    },
  },
});

export const financialTools = [
  createTool(
    "get_income_statements",
    "Get income statements for a company.",
    getIncomeStatementsSchema,
    get_income_statements
  ),
  createTool(
    "get_balance_sheets",
    "Get balance sheets for a company.",
    getBalanceSheetsSchema,
    get_balance_sheets
  ),
  createTool(
    "get_cash_flow_statements",
    "Get cash flow statements for a company.",
    getCashFlowStatementsSchema,
    get_cash_flow_statements
  ),
  createTool(
    "get_current_stock_price",
    "Get the current / latest price of a company.",
    getCurrentStockPriceSchema,
    get_current_stock_price
  ),
  createTool(
    "get_historical_stock_prices",
    "Gets historical stock prices for a company.",
    getHistoricalStockPricesSchema,
    get_historical_stock_prices
  ),
  createTool(
    "get_company_news",
    "Get news for a company.",
    getCompanyNewsSchema,
    get_company_news
  ),
  createTool(
    "get_available_crypto_tickers",
    "Gets all available crypto tickers.",
    getAvailableCryptoTickersSchema,
    get_available_crypto_tickers
  ),
  createTool(
    "get_historical_crypto_prices",
    "Gets historical prices for a crypto currency.",
    getHistoricalCryptoPricesSchema,
    get_historical_crypto_prices
  ),
  createTool(
    "get_current_crypto_price",
    "Get the current / latest price of a crypto currency.",
    getCurrentCryptoPriceSchema,
    get_current_crypto_price
  ),
];
