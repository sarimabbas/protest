import { oas31 } from "openapi3-ts";

export const commonReponses: Record<
  string,
  {
    openAPISchema: oas31.ResponseObject;
    response: Response;
  }
> = {
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
    response: new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    }),
  },
};
