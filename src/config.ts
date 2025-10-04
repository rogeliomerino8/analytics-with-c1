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
      text: "Explica la tendencia de ingresos de Apple en los últimos 5 años",
      type: "explain",
    },
    {
      text: "Investiga el crecimiento de ingresos de Nvidia desde 2020",
      type: "investigate",
    },
    {
      text: "Analiza la ganancia neta de Tesla este año",
      type: "analyze",
    },
  ],
};
