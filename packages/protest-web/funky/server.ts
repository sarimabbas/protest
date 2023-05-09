import { z } from "zod";

interface ICreateRequestHandlerProps<T, R> {
  request: z.ZodType<T>;
  response: z.ZodType<R>;
}

interface ICreateRequestHandlerReturn<T, R> {
  exports: {
    request: T;
    response: R;
  };
}

export const createRequestHandler = <T, R>(
  props: ICreateRequestHandlerProps<T, R>
): ICreateRequestHandlerReturn<T, R> => {
  return {
    exports: {
      request: {} as T,
      response: {} as R,
    },
  };
};
