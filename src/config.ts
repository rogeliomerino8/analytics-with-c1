import type { Suggestion } from "./app/components/Composer/Suggestions";

type Config = {
  /**
   * The prompt suggestions to show during the zero state when the user has yet to interact with the agent / copilot.
   */
  prefilledSuggestions?: Suggestion[];
};

export const config: Config = {
  prefilledSuggestions: [
    { text: "Show me 3 stocks with net income > $10B", type: "explain" },
    { text: "What is the latest news for Tesla?", type: "investigate" },
    {
      text: "Show me Microsoft's latest quarterly earnings report.",
      type: "analyze",
    },
  ],
};
