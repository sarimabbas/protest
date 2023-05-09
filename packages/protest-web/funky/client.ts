interface IFetcherOptions<
  TInput extends object,
  // TOutput extends object,
  TMethod extends "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  TPath extends string
> {
  input: TInput;
  method: TMethod;
  path: TPath;
}

type IClientTypes = {
  input: object;
  output: object;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
};

type IClientOptions<T extends IClientTypes> = IFetcherOptions<
  T["input"],
  // T["output"],
  T["method"],
  T["path"]
>;

interface IFetcherReturn<TOutput> {
  output: TOutput;
}

export const fetcher = async <T extends IClientTypes>(
  options: IClientOptions<T>
): Promise<IFetcherReturn<T["output"]>> => {
  const resp = await fetch(options.path, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options.input),
  });

  const output = await resp.json();
  return { output };
};
