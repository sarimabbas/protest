import { z } from "zod";
import { IClientTypes } from "./server";
import { HTTPMethod, httpMethodSupportsRequestBody } from "./utils";

export interface IMakeFetcherProps {
  /**
   * the base URL of the server
   */
  baseUrl: string;
  /**
   * headers to send with every request
   */
  headers?: Headers;
}

/**
 *
 * @param outerProps - the props to configure the fetcher
 * @returns a function that can be used to make requests to the server
 */
export const makeFetcher = (outerProps: IMakeFetcherProps) => {
  /**
   *
   * @param props - the props to make the request
   * @returns the response from the server
   */
  const fetcher = async <
    TConfig extends IClientTypes<
      z.AnyZodObject,
      z.AnyZodObject,
      HTTPMethod,
      string
    >
  >(
    props: Pick<TConfig, "input" | "method" | "path"> & {
      validator?: TConfig["output"];
    }
  ): Promise<TConfig["output"]> => {
    const url = new URL(props.path, outerProps.baseUrl);
    const resp = await fetch(
      httpMethodSupportsRequestBody[props.method]
        ? url
        : new URL(url.toString() + "?" + new URLSearchParams(props.input)),
      {
        method: props.method,
        headers: {
          ...(httpMethodSupportsRequestBody[props.method]
            ? { "Content-Type": "application/json" }
            : {}),
          ...(outerProps.headers
            ? Object.fromEntries(outerProps.headers.entries())
            : {}),
        },
        body: httpMethodSupportsRequestBody[props.method]
          ? JSON.stringify(props.input)
          : undefined,
      }
    );

    const output = await resp.json();

    if (props.validator) {
      props.validator.parse(output);
    }

    return output;
  };

  return fetcher;
};
