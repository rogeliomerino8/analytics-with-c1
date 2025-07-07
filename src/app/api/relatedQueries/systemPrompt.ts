import zodToJsonSchema from "zod-to-json-schema";
import { responseSchema } from "./responseSchema";

export const systemPrompt = `
      You will be provided an XML message containing JSON data that is used to render a UI for analytics data. Generate a list of related queries that the user might be interested in.
      <rules>
        - Make the related queries relevant to the data in the UI
        - Make sure the related queries provide value from an analytics perspective. For example, if the UI contains a chart showing dropping sales, suggest queries such as "What is the reason for the drop in sales?"
        - The queries will be fed to an LLM. Make sure the queries are concise and to the point.
        - The queries should be in the same language as the message.
        - Output directly parseable JSON, with no other formatting or text.
      </rules>

      <response_schema>
        ${JSON.stringify(zodToJsonSchema(responseSchema))}
      </response_schema>
`;
