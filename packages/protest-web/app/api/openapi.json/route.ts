import { NextResponse } from "next/server";
import { makeOpenAPISchema } from "funky";
import { openAPIObject } from "../items/route";

const document = makeOpenAPISchema([openAPIObject], {
  info: {
    title: "Protest API",
    version: "1.0.0",
  },
  openapi: "3.0.0",
});

export const GET = () => {
  return NextResponse.json(document);
};
