import { z } from "zod";
import { oas31 } from "openapi3-ts";
import merge from "lodash.merge";
import { generateSchema } from "@anatine/zod-openapi";

const httpMethodSupportsRequestBody: Record<string, boolean> = {
  GET: false,
  POST: true,
  PUT: true,
  PATCH: true,
  DELETE: false,
};

interface ICreateRequestHandlerProps<
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject
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
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /**
   * @returns a callback inside which you can run your logic
   */
  run: ({
    request,
    input,
    output,
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
    output: (output: z.infer<TOutput>) => Promise<Response>;
  }) => Promise<Response>;
  /**
   * patch the generated openAPI schema with your own
   */
  openAPISchema?: Partial<oas31.OperationObject>;
}

interface ICreateRequestHandlerReturn<
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject
> {
  /**
   * generated typescript types
   */
  exports: {
    input: z.infer<TInput>;
    output: z.infer<TOutput>;
  };
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
  TOutput extends z.AnyZodObject
>(
  props: ICreateRequestHandlerProps<TInput, TOutput>
): ICreateRequestHandlerReturn<TInput, TOutput> => {
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
    },
  };

  const handler = async (request: Request) => {
    if (request.method !== props.method) {
      return new Response("Method not allowed", { status: 405 });
    }

    const { searchParams } = new URL(request.url);
    const unsafeData = httpMethodSupportsRequestBody[request.method]
      ? await request.json()
      : Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsedData = await props.input.safeParseAsync(unsafeData);

    if (!parsedData.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request payload",
          details: parsedData.error,
        }),
        {
          status: 400,
        }
      );
    }

    const input = parsedData.data;

    const output = async (output: z.infer<TOutput>) => {
      return new Response(JSON.stringify(output), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    return props.run(request, input, output);
  };

  return {
    // implementation does not matter
    // used to export types to the client
    exports: {
      input: {},
      output: {},
    },
    openAPISchema: merge(openAPISchema, props.openAPISchema),
    handler,
  };
};
