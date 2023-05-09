import { z } from "zod";

interface ICreateRequestHandlerProps<
  TRequest extends z.ZodTypeAny,
  TResponse extends z.ZodTypeAny
> {
  request: TRequest;
  response: TResponse;
}

interface ICreateRequestHandlerReturn<
  TRequest extends z.ZodTypeAny,
  TResponse extends z.ZodTypeAny
> {
  exports: {
    request: z.infer<TRequest>;
    response: z.infer<TResponse>;
  };
}

export const createRequestHandler = <
  TRequest extends z.ZodTypeAny,
  TResponse extends z.ZodTypeAny
>(
  props: ICreateRequestHandlerProps<TRequest, TResponse>
): ICreateRequestHandlerReturn<TRequest, TResponse> => {
  return {
    // implementation does not matter
    // used to export types to the client
    exports: {
      request: {},
      response: {},
    },
  };
};
