"use server";

import { openAI } from "@/openai";
import { getXataClient } from "@/xata";
import mql from "@microlink/mql";
import normalizeUrl from "normalize-url";

const xata = getXataClient();

interface ICreateContentProps {
  listId: string;
  text: string;
  url: string;
}

export const createContent = async (data: FormData) => {
  const listId = data.get("listId") as string;
  const url = normalizeUrl(data.get("url") as string, {
    sortQueryParameters: true,
  });
  let text = data.get("text") as string;

  if (!listId && !(text || url)) {
    throw new Error("Missing required fields");
  }

  const meta = await mql(url);
  text = meta.data.description ?? text;

  const resp = await openAI.createEmbedding({
    input: text,
    model: "text-embedding-ada-002",
  });
  const [{ embedding }] = resp.data.data;

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
      embeddingAda: embedding,
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
};
