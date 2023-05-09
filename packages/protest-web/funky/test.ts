import { createRequestHandler } from "./server";
import { z } from "zod";

const { exports, openAPISchema } = createRequestHandler({
  input: z.object({
    id: z.string(),
    name: z.string(),
  }),
  output: z.object({
    id: z.string(),
  }),
  method: "GET",
  run: async ({ request, input, output }) => {
    const { id } = input;
    return output({ id });
  },
});
