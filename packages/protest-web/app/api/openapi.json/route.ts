import { OpenAPIObject, OpenAPIPathsObject } from "@sarim.garden/clover";
import { NextResponse } from "next/server";
import { openAPIItemsPOST } from "../items/route";
import { openAPIListGET } from "../lists/[id]/route";

const pathsObject: OpenAPIPathsObject = [
  openAPIItemsPOST,
  openAPIListGET,
].reduce((acc, curr) => {
  Object.keys(curr).forEach((k) => {
    acc[k] = {
      ...acc[k],
      ...curr[k],
    };
  });
  return acc;
}, {});

const document: OpenAPIObject = {
  info: {
    title: "Protest API",
    version: "1.0.0",
  },
  openapi: "3.0.0",
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
