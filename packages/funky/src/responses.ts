import { oas31 } from "openapi3-ts";

export const commonReponses = {
  405: {
    openAPISchema: {
      description: "Method not allowed",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
              },
            },
          },
        },
      },
    },
    response: () =>
      new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      }),
  },
  400: {
    openAPISchema: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
              },
              details: {
                type: "object",
              },
            },
          },
        },
      },
    },
    response: (details: Record<string, any>) =>
      new Response(JSON.stringify({ error: "Bad request", details }), {
        status: 400,
      }),
  },
} satisfies Record<
  string,
  {
    openAPISchema: oas31.ResponseObject;
    response: (props: any) => Response;
  }
>;
