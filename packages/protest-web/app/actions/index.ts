"use server";

import { openAI } from "@/openai";
import { ItemsRecord, getXataClient } from "@/xata";
import mql from "@microlink/mql";
import { SelectedPick } from "@xata.io/client";
import normalizeUrl from "normalize-url";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { z } from "zod";

const xata = getXataClient();

export const addItem = zact(
  z.object({
    listId: z.string(),
    url: z.string().optional(),
    text: z.string().optional(),
  })
)(async (input) => {
  let { listId, url, text } = input;

  if (url) {
    url = normalizeUrl(url as string, {
      sortQueryParameters: true,
    });
    const meta = await mql(url);
    text = meta.data.description ?? text;
  }

  if (!text) {
    throw new Error("Missing required fields");
  }

  const resp = await openAI.createEmbedding({
    input: text,
    model: "text-embedding-ada-002",
  });
  const [{ embedding }] = resp.data.data;

  let itemId = "";
  let existingItem: Readonly<SelectedPick<ItemsRecord, ["*"]>> | null = null;

  if (url) {
    existingItem = await xata.db.items
      .filter({
        url,
      })
      .getFirst();
  } else if (text) {
    existingItem = await xata.db.items
      .filter({
        text,
      })
      .getFirst();
  }

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

  revalidatePath(`/lists/${listId}`);
});
