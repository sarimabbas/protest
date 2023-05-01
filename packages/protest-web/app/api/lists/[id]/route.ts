import { IOutputItem, ZPOSTBody, ZPOSTResponse } from "@/../shared/src";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsedBody = ZPOSTBody.safeParse(body);
  if (parsedBody.success === false) {
    return NextResponse.json(parsedBody.error, { status: 400 });
  }

  const outputs: IOutputItem[] = parsedBody.data.inputs.map((input) => ({
    id: input.id,
    show: input.content.length > 0,
  }));

  const parsedResponse = ZPOSTResponse.safeParse({ outputs });
  if (parsedResponse.success === false) {
    return NextResponse.json(parsedResponse.error, { status: 500 });
  }

  return NextResponse.json(parsedResponse);
};
