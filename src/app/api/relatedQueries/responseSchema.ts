import { z } from "zod";

export const responseSchema = z.object({
  relatedQueries: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string({
        description:
          "Lucide icon to use for the query. Use the icon name from the Lucide icon set.",
      }),
    })
  ),
});
