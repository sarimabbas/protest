import { createRequestHandler } from "./server";
import { z } from "zod";

const { exports, openAPISchema } = createRequestHandler({
  request: z.object({
    id: z.string(),
  }),
  response: z.object({
    id: z.string(),
  }),
  method: "GET",
});
