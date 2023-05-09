import { createRequestHandler } from "./server";
import { fetcher } from "./client";
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
  run: async ({ request, input, output }) => {
    const { id } = input;
    return output({ id });
  },
});

const resp = fetcher<
  (typeof clientTypes)["input"],
  (typeof clientTypes)["output"],
  (typeof clientTypes)["method"],
  (typeof clientTypes)["path"]
>({
  input: {
    id: "123",
    name: "test",
  },
  method: "GET",
  path: "/test",
});
