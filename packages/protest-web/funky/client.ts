import { z } from "zod";
import { IClientTypes } from "./server";
import { HTTPMethod, httpMethodSupportsRequestBody } from "./utils";

interface IMakeFetcherProps {
  baseUrl: string;
  headers?: Headers;
}

export const makeFetcher = (outerProps: IMakeFetcherProps) => {
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
          "Content-Type": "application/json",
          ...(outerProps.headers ? Object.fromEntries(outerProps.headers) : {}),
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
