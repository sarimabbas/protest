import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ZInputItem = z.object({
  id: z.string(),
  content: z.string(),
});

const ZPostBody = z.object({
  inputs: z.array(ZInputItem),
});

const ZOutputItem = z.object({
  id: z.string(),
  show: z.boolean(),
});

const ZPostResponse = z.object({
  outputs: z.array(ZOutputItem),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsedBody = ZPostBody.safeParse(body);
  if (parsedBody.success === false) {
    return NextResponse.json(parsedBody.error, { status: 400 });
  }

  const outputs: z.infer<typeof ZOutputItem>[] = parsedBody.data.inputs.map(
    (input) => ({
      id: input.id,
      show: input.content.length > 0,
    })
  );

  const parsedResponse = ZPostResponse.safeParse({ outputs });
  if (parsedResponse.success === false) {
    return NextResponse.json(parsedResponse.error, { status: 500 });
  }

  return NextResponse.json(parsedResponse);
};
