import { z } from "zod";
import { oas31 } from "openapi3-ts";
import merge from "lodash.merge";
import { generateSchema } from "@anatine/zod-openapi";
import { commonReponses } from "./responses";
import { httpMethodSupportsRequestBody } from "./utils";

interface ICreateRequestHandlerProps<
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject,
  TMethod extends "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  TPath extends string
> {
  /**
   * describe the shape of the input
   */
  input: TInput;
  /**
   * describe the shape of the output
   */
  output: TOutput;
  /**
   * specify the HTTP method
   */
  method: TMethod;
  /**
   * specify the path
   */
  path: TPath;
  /**
   * @returns a callback inside which you can run your logic
   */
  run: ({
    request,
    input,
    sendOutput,
  }: {
    /**
     * the raw request, do whatever you want with it
     */
    request: Request;
    /**
     * a helper with the input data
     */
    input: z.infer<TInput>;
    /**
     * @param output - the output data
     * @returns a helper to send the output
     */
    sendOutput: (output: z.infer<TOutput>) => Promise<Response>;
  }) => Promise<Response>;
  /**
   * patch the generated openAPI schema with your own
   */
  openAPISchema?: Partial<oas31.OperationObject>;
}

export interface IClientTypes<
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject,
  TMethod extends "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  TPath extends string
> {
  input: z.infer<TInput>;
  output: z.infer<TOutput>;
  method: TMethod;
  path: TPath;
}

interface ICreateRequestHandlerReturn<
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject,
  TMethod extends "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  TPath extends string
> {
  /**
   * generated typescript types
   */
  clientTypes: IClientTypes<TInput, TOutput, TMethod, TPath>;
  /**
   * OpenAPI schema for this route
   */
  openAPISchema: oas31.OperationObject;
  /**
   * @returns WinterCG compatible handler that you can use in your routes
   */
  handler: (request: Request) => Promise<Response>;
}

export const createRequestHandler = <
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject,
  TMethod extends "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  TPath extends string
>(
  props: ICreateRequestHandlerProps<TInput, TOutput, TMethod, TPath>
): ICreateRequestHandlerReturn<TInput, TOutput, TMethod, TPath> => {
  const openAPISchema: oas31.OperationObject = {
    parameters: httpMethodSupportsRequestBody[props.method]
      ? // todo: add support for path parameters
        Object.keys(props.input.shape).map((key) => ({
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
              schema: generateSchema(props.input),
            },
          },
        },
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: generateSchema(props.output),
          },
        },
      },
      405: commonReponses[405].openAPISchema,
      400: commonReponses[400].openAPISchema,
    },
  };

  const handler = async (request: Request) => {
    if (request.method !== props.method) {
      return commonReponses[405].response();
    }

    const unsafeData = httpMethodSupportsRequestBody[request.method]
      ? await request.json()
      : Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsedData = await props.input.safeParseAsync(unsafeData);

    if (!parsedData.success) {
      return commonReponses[400].response(parsedData.error);
    }

    const input = parsedData.data;

    const sendOutput = async (output: z.infer<TOutput>) => {
      return new Response(JSON.stringify(output), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    return props.run({ request, input, sendOutput });
  };

  return {
    clientTypes: {
      // implementation does not matter
      input: {},
      output: {},
      method: props.method,
      path: props.path,
    },
    openAPISchema: merge(openAPISchema, props.openAPISchema),
    handler,
  };
};