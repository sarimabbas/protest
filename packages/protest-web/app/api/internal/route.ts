import { openAI } from "@/openai";
import { getXataClient } from "@/xata";
import { NextRequest, NextResponse } from "next/server";
import mql from "@microlink/mql";

const xata = getXataClient();

const createContent = async (request: NextRequest) => {
  const body = await request.json();
  let {
    listId,
    text,
    url,
  }: {
    listId: string;
    text: string;
    url: string;
  } = body;

  if (url) {
    const meta = await mql(url);
    text = meta.data.description ?? text;
  }

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
        url,
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
