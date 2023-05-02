import { openAI } from "@/openai";
import { getXataClient } from "@/xata";
import { NextRequest, NextResponse } from "next/server";

const xata = getXataClient();

const createContent = async (request: NextRequest) => {
  const body = await request.json();
  const {
    listId,
    text,
  }: {
    listId: string;
    text: string;
  } = body;

  let vector: number[] = [];
  try {
    const resp = await openAI.createEmbedding({
      input: text,
      model: "text-embedding-ada-002",
    });
    const [{ embedding }] = resp.data.data;
    vector = embedding;
  } catch (e) {
    console.error(e);
  }

  try {
    await xata.db.content.create({
      text,
      embedding: vector,
      list: {
        id: listId,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: e.message,
        },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({
    success: true,
  });
};

export { createContent as POST };
