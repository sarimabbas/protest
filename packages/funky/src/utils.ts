export type HumanReadable<T> = {
  [K in keyof T]: T[K];
} & {};

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const httpMethodSupportsRequestBody: Record<HTTPMethod, boolean> = {
  GET: false,
  POST: true,
  PUT: true,
  PATCH: true,
  DELETE: false,
};
