import { z } from "zod";
import { oas31 } from "openapi3-ts";
import merge from "lodash.merge";
import { generateSchema } from "@anatine/zod-openapi";

type HumanReadable<T> = {
  [K in keyof T]: T[K];
} & {};

const httpMethodSupportsRequestBody: Record<string, boolean> = {
  GET: false,
  POST: true,
  PUT: true,
  PATCH: true,
  DELETE: false,
};

interface ICreateRequestHandlerProps<
  TRequest extends z.AnyZodObject,
  TResponse extends z.AnyZodObject
> {
  request: TRequest;
  response: TResponse;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

  // patch the generated openAPI schema with your own
  openAPISchema?: Partial<oas31.OperationObject>;
}

interface ICreateRequestHandlerReturn<
  TRequest extends z.AnyZodObject,
  TResponse extends z.AnyZodObject
> {
  exports: {
    request: z.infer<TRequest>;
    response: z.infer<TResponse>;
  };
  openAPISchema: oas31.OperationObject;
}

export const createRequestHandler = <
  TRequest extends z.AnyZodObject,
  TResponse extends z.AnyZodObject
>(
  props: ICreateRequestHandlerProps<TRequest, TResponse>
): ICreateRequestHandlerReturn<TRequest, TResponse> => {
  const openAPISchema: oas31.OperationObject = {
    parameters: httpMethodSupportsRequestBody[props.method]
      ? // todo: add support for path parameters
        Object.keys(props.request.shape).map((key) => ({
          name: key,
          in: "query",
          schema: {
            type: "string",
          },
        }))
      : [],
    requestBody: httpMethodSupportsRequestBody[props.method]
      ? undefined
      : {
          content: {
            "application/json": {
              schema: generateSchema(props.request),
            },
          },
        },
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: generateSchema(props.response),
          },
        },
      },
    },
  };

  return {
    // implementation does not matter
    // used to export types to the client
    exports: {
      request: {},
      response: {},
    },
    openAPISchema: merge(openAPISchema, props.openAPISchema),
  };
};
