import { z } from "zod";

export const ZInputItem = z.object({
  id: z.string(),
  content: z.string(),
});

export type IInputItem = z.infer<typeof ZInputItem>;

export const ZPOSTBody = z.object({
  inputs: z.array(ZInputItem),
});

export type IPOSTBody = z.infer<typeof ZPOSTBody>;

export const ZOutputItem = z.object({
  id: z.string(),
  show: z.boolean(),
});

export type IOutputItem = z.infer<typeof ZOutputItem>;

export const ZPOSTResponse = z.object({
  outputs: z.array(ZOutputItem),
});

export type IPOSTResponse = z.infer<typeof ZPOSTResponse>;
