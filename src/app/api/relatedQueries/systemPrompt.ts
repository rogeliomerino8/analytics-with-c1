import zodToJsonSchema from "zod-to-json-schema";
import { responseSchema } from "./responseSchema";

export const systemPrompt = `
      You will be provided an XML message containing JSON data that is used to render a UI for analytics data. Generate a list of 3 related queries that the user might be interested in.
      <rules>
        - Make the related queries relevant to the data in the UI
        - Make sure the related queries provide value from an analytics perspective. For example, if the UI contains a chart showing dropping sales, suggest queries such as "What is the reason for the drop in sales?"
        - The queries will be fed to an LLM. Make sure the queries are concise and to the point.
        - There should be one query of each type: explain, investigate, analyze (in that order, and only 3 total). Each type of query should start with the respective type word.
          - Explain queries should be about explaining the data in the UI
          - Investigate queries should be about investigating plausible causes of the data (such as increase or decrease in trends).
          - Analyze queries should be about analyzing the data in the UI.
        - Try to make sure the queries lead to visual results (charts and tables).
        - Try to keep the queries shorter than 13 words.
        - Try to use actual numbers from the provided data in the queries.
        - The queries should be in the same language as the message.
        - Output directly parseable JSON, with no other formatting or text.
      </rules>

      <response_schema>
        ${JSON.stringify(zodToJsonSchema(responseSchema))}
      </response_schema>
`;
