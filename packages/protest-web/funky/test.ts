import { createRequestHandler } from "./server";
import { makeFetcher } from "./client";
import { z } from "zod";

const { clientTypes, openAPISchema } = createRequestHandler({
  input: z.object({
    id: z.string(),
    name: z.string(),
  }),
  output: z.object({
    id: z.string(),
  }),
  method: "GET",
  path: "/test",
  run: async ({ request, input, sendOutput }) => {
    const { id } = input;
    return sendOutput({ id });
  },
});

const getTest = makeFetcher({
  baseUrl: "http://localhost:3000",
});

const resp = getTest<typeof clientTypes>({
  input: {
    id: "test",
    name: "test",
  },
  method: "GET",
  path: "/test",
});
