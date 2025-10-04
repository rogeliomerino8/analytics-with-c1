import zodToJsonSchema from "zod-to-json-schema";
import { responseSchema } from "./responseSchema";

export const systemPrompt = `
      Se te proporcionará un mensaje XML que contiene datos JSON que se usan para renderizar una interfaz de usuario para datos de análisis. Genera una lista de 3 consultas relacionadas que podrían interesar al usuario.
      <reglas>
        - Haz que las consultas relacionadas sean relevantes a los datos en la interfaz de usuario
        - Asegúrate de que las consultas relacionadas proporcionen valor desde una perspectiva de análisis. Por ejemplo, si la interfaz contiene un gráfico que muestra ventas en declive, sugiere consultas como "¿Cuál es la razón de la caída en las ventas?"
        - Las consultas se alimentarán a un LLM. Asegúrate de que las consultas sean concisas y directas.
        - Debe haber una consulta de cada tipo: explicar, investigar, analizar (en ese orden, y solo 3 en total). Cada tipo de consulta debe comenzar con la respectiva palabra tipo.
          - Las consultas de Explicar deben ser sobre explicar los datos en la interfaz de usuario
          - Las consultas de Investigar deben ser sobre investigar causas plausibles de los datos (como aumento o disminución en tendencias).
          - Las consultas de Analizar deben ser sobre analizar los datos en la interfaz de usuario.
        - Trata de asegurarte de que las consultas lleven a resultados visuales (gráficos y tablas).
        - Trata de mantener las consultas con menos de 13 palabras.
        - Trata de usar números reales de los datos proporcionados en las consultas.
        - Las consultas deben estar en español.
        - Genera JSON directamente parseable, sin otro formato o texto.
      </reglas>

      <esquema_respuesta>
        ${JSON.stringify(zodToJsonSchema(responseSchema))}
      </esquema_respuesta>
`;
