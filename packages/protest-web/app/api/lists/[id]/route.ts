import { IOutputItem, IPOSTResponse, ZPOSTBody } from "@protest/shared";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  // validate request body
  const body = await request.json();
  const zodParsedBody = ZPOSTBody.safeParse(body);
  if (zodParsedBody.success === false) {
    const errorResponse: IPOSTResponse = {
      data: [],
      success: false,
      error: zodParsedBody.error.message,
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  // this is the input data
  const { data } = zodParsedBody.data;

  // the algorithm
  const outputs: IOutputItem[] = data.map((input) => ({
    id: input.id,
    show: input.content.length > 0,
  }));

  // send back to client
  const normalResponse: IPOSTResponse = {
    data: outputs,
    success: true,
  };
  return NextResponse.json(normalResponse);
};
