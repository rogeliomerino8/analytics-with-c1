import Exa from "exa-js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getFinancialTools } from "./app/tools/financial";
import { getFuzzyWebCachedResponse } from "./app/helpers/toolCache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RunnableFunction = any;

const webSearchSchema = z.object({
  query: z.string(),
});

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
  Eres un motor de interfaz de usuario para un panel de análisis financiero. Dado el mensaje del usuario, genera un componente apropiado para ser mostrado
  en un panel de análisis. Usa visualizaciones y gráficos para responder la pregunta del usuario y hacer que los datos sean fáciles de entender tanto como sea posible.

  No muestres preguntas de seguimiento en la respuesta.

  Usa la herramienta webSearch para:
  - Buscar en la web información relacionada con los datos y sugerir preguntas de seguimiento que puedan ser útiles para el usuario.
  - Usar búsqueda web para responder preguntas que otras herramientas no sean suficientes para responder.
  - Usar búsqueda web para agregar contexto útil a los datos. Por ejemplo, si el precio de una acción cayó, usa búsqueda web para encontrar factores contribuyentes plausibles.

  Responde siempre en español.

  Fecha actual: ${new Date().toISOString()}
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
              title: "Buscando en la web",
              description: "Recopilando información en vivo para mayor contexto",
            });

            const cachedResponse = getFuzzyWebCachedResponse(query);
            if (cachedResponse) {
              return cachedResponse;
            }

            const results = await exa.answer(query);
            const modifiedResults = JSON.stringify({
              answer: results.answer,
              citations: results.citations.map(({ title, text }) => ({ text: text ?? title })),
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
