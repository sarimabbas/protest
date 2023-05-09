import { generateSchema } from "@anatine/zod-openapi";
import merge from "lodash.merge";
import { oas31 } from "openapi3-ts";
import { z } from "zod";
import { commonReponses } from "./responses";
import {
  HTTPMethod,
  HumanReadable,
  PathParamNames,
  httpMethodSupportsRequestBody,
  getKeysFromPathPattern,
  getParamsFromPath,
} from "./utils";

export interface IMakeRequestHandlerProps<
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject,
  TMethod extends HTTPMethod,
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
   * a callback inside which you can run your logic
   * @returns a response to send back to the client
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
    sendOutput: (
      output: z.infer<TOutput>,
      options?: Partial<ResponseInit>
    ) => Promise<Response>;
  }) => Promise<Response>;
  /**
   * patch the generated openAPI schema with your own
   */
  openAPISchema?: Partial<oas31.PathObject>;
}

export interface IClientTypes<
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject,
  TMethod extends HTTPMethod,
  TPath extends string
> {
  /**
   * the typescript types for the input
   * exclude the path parameters that are automatically added
   */
  input: HumanReadable<Omit<z.infer<TInput>, PathParamNames<TPath>>>;
  /**
   * the zod schema for the output
   */
  output: TOutput;
  /**
   * the HTTP method
   */
  method: TMethod;
  /**
   * the path the route is available on
   */
  path: TPath;
}

export interface IMakeRequestHandlerReturn<
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject,
  TMethod extends HTTPMethod,
  TPath extends string
> {
  /**
   * generated typescript types
   */
  clientTypes: IClientTypes<TInput, TOutput, TMethod, TPath>;
  /**
   * OpenAPI schema for this route
   */
  openAPISchema: oas31.PathObject;
  /**
   * @returns WinterCG compatible handler that you can use in your routes
   */
  handler: (request: Request) => Promise<Response>;
}

export const makeRequestHandler = <
  TInput extends z.AnyZodObject,
  TOutput extends z.AnyZodObject,
  TMethod extends HTTPMethod,
  TPath extends string
>(
  props: IMakeRequestHandlerProps<TInput, TOutput, TMethod, TPath>
): IMakeRequestHandlerReturn<TInput, TOutput, TMethod, TPath> => {
  const openAPIParameters: (oas31.ParameterObject | oas31.ReferenceObject)[] = [
    // query parameters
    ...(!httpMethodSupportsRequestBody[props.method]
      ? Object.keys(props.input.shape).map((key) => ({
          name: key,
          in: "query" as oas31.ParameterLocation,
          schema: {
            type: "string" as oas31.SchemaObjectType,
          },
        }))
      : []),
    // path parameters
    ...getKeysFromPathPattern(props.path).map((key) => ({
      name: String(key.name),
      in: "path" as oas31.ParameterLocation,
      schema: {
        type: "string" as oas31.SchemaObjectType,
      },
    })),
  ];

  const openAPIRequestBody:
    | oas31.ReferenceObject
    | oas31.RequestBodyObject
    | undefined = httpMethodSupportsRequestBody[props.method]
    ? {
        content: {
          "application/json": {
            schema: generateSchema(props.input),
          },
        },
      }
    : undefined;

  const openAPISchema: oas31.PathObject = {
    [props.path]: {
      [props.method.toLowerCase()]: {
        parameters: openAPIParameters,
        requestBody: openAPIRequestBody,
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
      },
    },
  };

  const handler = async (request: Request) => {
    const clonedRequest = request.clone();

    if (request.method !== props.method) {
      return commonReponses[405].response();
    }

    const unsafeData = {
      ...getParamsFromPath(props.path, new URL(request.url).pathname),
      ...(httpMethodSupportsRequestBody[request.method as HTTPMethod]
        ? await request.json()
        : Object.fromEntries(new URL(request.url).searchParams.entries())),
    };

    const parsedData = await props.input.safeParseAsync(unsafeData);

    if (!parsedData.success) {
      return commonReponses[400].response(parsedData.error);
    }

    const input = parsedData.data;

    const sendOutput = async (
      output: z.infer<TOutput>,
      options?: Partial<ResponseInit>
    ) => {
      return new Response(
        JSON.stringify(output),
        merge(
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
          options
        )
      );
    };

    return props.run({ request: clonedRequest, input, sendOutput });
  };

  return {
    clientTypes: {
      input: {} as any, // implementation does not matter, we just need the types
      output: props.output, // echo the zod schema
      method: props.method,
      path: props.path,
    },
    openAPISchema: merge(openAPISchema, props.openAPISchema),
    handler,
  };
};
