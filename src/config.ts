import type { Suggestion } from "./app/components/Composer/Suggestions";

type Config = {
  /**
   * The prompt suggestions to show during the zero state when the user has yet to interact with the agent / copilot.
   */
  prefilledSuggestions?: Suggestion[];
};

export const config: Config = {
  prefilledSuggestions: [
    {
      text: "Explain Apple's revenue trend over the past 5 years",
      type: "explain",
    },
    {
      text: "Investigate Nvidia's revenue growth since 2020",
      type: "investigate",
    },
    {
      text: "Analyze Tesla's net profit this year",
      type: "analyze",
    },
  ],
};
