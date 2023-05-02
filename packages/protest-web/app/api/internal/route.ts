import { openAI } from "@/openai";
import { getXataClient } from "@/xata";
import { NextRequest, NextResponse } from "next/server";

const xata = getXataClient();

const createContent = async (request: NextRequest) => {
  const body = await request.json();
  const {
    listId,
    text,
    url,
  }: {
    listId: string;
    text: string;
    url: string;
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
    let itemId = "";

    const existingItem = await xata.db.items
      .filter({
        url,
      })
      .getFirst();

    if (existingItem) {
      itemId = existingItem.id;
    } else {
      const item = await xata.db.items.create({
        text,
        embeddingAda: vector,
      });
      itemId = item.id;
    }

    await xata.db.itemsOnLists.create({
      item: {
        id: itemId,
      },
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
