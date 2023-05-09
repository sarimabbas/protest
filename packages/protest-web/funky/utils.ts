export type HumanReadable<T> = {
  [K in keyof T]: T[K];
} & {};

export const httpMethodSupportsRequestBody: Record<string, boolean> = {
  GET: false,
  POST: true,
  PUT: true,
  PATCH: true,
  DELETE: false,
};
