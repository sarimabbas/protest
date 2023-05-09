interface IFetcherProps<
  TInput,
  TMethod extends "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  TPath extends string
> {
  input: TInput;
  method: TMethod;
  path: TPath;
}

interface IFetcherReturn<TOutput> {
  output: TOutput;
}

export const fetcher = async <
  TInput,
  TOutput,
  TMethod extends "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  TPath extends string
>(
  props: IFetcherProps<TInput, TMethod, TPath>
): Promise<IFetcherReturn<TOutput>> => {
  const resp = await fetch(props.path, {
    method: props.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(props.input),
  });

  const output = await resp.json();
  return { output };
};
