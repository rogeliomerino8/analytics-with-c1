import { z } from "zod";

export const responseSchema = z.object({
  relatedQueries: z.array(
    z.object({
      text: z.string(),
      type: z.enum(["explain", "investigate", "analyze"]),
      title: z.string({description: "A short title for the query to display on the UI."}),
    })
  ),
});
