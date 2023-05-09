import { IClientTypes } from "./server";
import { httpMethodSupportsRequestBody } from "./utils";

export const fetcher = async <T extends IClientTypes<any, any, any, string>>(
  props: Pick<T, "input" | "method" | "path">
): Promise<T["output"]> => {
  const resp = await fetch(
    httpMethodSupportsRequestBody[props.method]
      ? props.path
      : `${props.path}?${new URLSearchParams(props.input).toString()}`,
    {
      method: props.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: httpMethodSupportsRequestBody[props.method]
        ? JSON.stringify(props.input)
        : undefined,
    }
  );

  const output = await resp.json();
  return output;
};
