import { z } from "zod";

export const responseSchema = z.object({
  relatedQueries: z.array(
    z.object({
      text: z.string(),
      type: z.enum(["explain", "investigate", "analyze"]),
    })
  ),
});
