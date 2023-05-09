import { createRequestHandler } from "funky";
import { z } from "zod";

const { handler: handlerGet } = createRequestHandler({
  input: z.object({
    name: z.string(),
  }),
  output: z.object({
    message: z.string(),
  }),
  method: "GET",
  path: "/api/test",
  run: async ({ input, sendOutput }) => {
    return sendOutput({
      message: `Hello, ${input.name}!`,
    });
  },
});

export { handlerGet as GET };

const { handler: handlerPost } = createRequestHandler({
  input: z.object({
    name: z.string(),
  }),
  output: z.object({
    message: z.string(),
  }),
  method: "POST",
  path: "/api/test",
  run: async ({ input, sendOutput }) => {
    return sendOutput({
      message: `Hello, ${input.name}!`,
    });
  },
});

export { handlerPost as POST };
