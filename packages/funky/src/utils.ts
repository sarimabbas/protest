import { Key, Path, pathToRegexp } from "path-to-regexp";
import { oas31 } from "openapi3-ts";

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

export const makePathRegex = (
  path: Path
): {
  regexp: RegExp;
  keys: Key[];
} => {
  const keys: Key[] = [];
  const regexp = pathToRegexp(path, keys);
  return {
    regexp,
    keys,
  };
};

export const runPathRegex = (path: string, regexp: RegExp) => {
  const match = regexp.exec(path);
  const params: Record<string, string> = {};
  if (match) {
    match.forEach((value, index) => {
      params[index.toString()] = value;
    });
  }
  return params;
};

/**
 * get all parameters from an API path
 * thanks to Zodios for this snippet
 * @param Path - API path
 * @details - this is using tail recursion type optimization from typescript 4.5
 */
export type PathParamNames<
  Path,
  Acc = never
> = Path extends `${string}:${infer Name}/${infer R}`
  ? PathParamNames<R, Name | Acc>
  : Path extends `${string}:${infer Name}`
  ? Name | Acc
  : Acc;

/**
 * Utility function to make an OpenAPI schema so users don't have to install openapi3-ts
 * @param schema - OpenAPI schema overrides
 * @returns OpenAPI schema
 */
export const makeOpenAPISchema = (
  schema: oas31.OpenAPIObject
): oas31.OpenAPIObject => {
  return {
    ...schema,
  };
};
