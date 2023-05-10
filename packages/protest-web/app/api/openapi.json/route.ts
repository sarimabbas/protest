import { NextResponse } from "next/server";
import { OpenAPIObject, OpenAPIPathsObject } from "funky";
import { openAPIPathsObject } from "../items/route";

const pathsObject: OpenAPIPathsObject = [openAPIPathsObject].reduce(
  (acc, curr) => {
    Object.keys(curr).forEach((k) => {
      acc[k] = {
        ...acc[k],
        ...curr[k],
      };
    });
    return acc;
  },
  {}
);

const document: OpenAPIObject = {
  info: {
    title: "Protest API",
    version: "1.0.0",
  },
  openapi: "3.0.0",
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
  paths: pathsObject,
};

export const GET = () => {
  return NextResponse.json(document);
};
