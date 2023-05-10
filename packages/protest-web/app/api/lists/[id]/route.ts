import { openAI } from "@/openai";
import { getXataClient } from "@/xata";
import { IOutputItem, ZPOSTBody, ZPOSTResponse } from "@protest/shared";
import { makeRequestHandler } from "funky";
import { z } from "zod";

const xata = getXataClient();

// used by the extension to check content against embeddings
export const { handler: POST, clientTypes } = makeRequestHandler({
  method: "POST",
  path: "/api/lists/:id",
  description: "Check content against a list",
  input: z
    .object({
      id: z.string(),
    })
    .merge(ZPOSTBody),
  output: ZPOSTResponse,
  run: async ({ input, sendOutput }) => {
    const { id, data } = input;

    // todo: RULE: keyword search

    // RULE: vector search
    const embeddingsResponse = await openAI.createEmbedding({
      input: data.map((d) => d.content),
      model: "text-embedding-ada-002",
    });
    const embeddings = embeddingsResponse.data.data.map((d) => d.embedding);
    const decisions = await Promise.all(
      embeddings.map(async (em, i) => {
        const vecSearch = await xata.db.itemsOnLists.vectorSearch(
          "item.embeddingAda",
          em,
          {
            filter: {
              list: id,
            },
          }
        );
        // console.log({
        //   inputText: data[i].content.slice(0, 100),
        //   vecSearch: vecSearch.map((v) => ({
        //     content: v.item.?.slice(0, 100),
        //     ...v.getMetadata(),
        //   })),
        // });
        return (vecSearch?.[0].getMetadata().score ?? 0) < 1.76;
      })
    );

    // todo: RULE: general LLM prompt

    // the algorithm
    const outputs: IOutputItem[] = data.map((input, idx) => ({
      id: input.id,
      show: decisions[idx],
    }));

    return sendOutput({
      data: outputs,
      success: true,
    });
  },
});

export const { handler: GET, openAPIPathsObject: openAPIListGET } =
  makeRequestHandler({
    method: "GET",
    path: "/api/lists/:id",
    description: "Get a list",
    input: z.object({
      id: z.string(),
    }),
    output: z.object({
      items: z.array(
        z.object({
          id: z.string(),
          text: z.string().optional(),
          url: z.string().optional(),
        })
      ),
    }),
    run: async ({ input, sendOutput }) => {
      const content = await xata.db.itemsOnLists
        .select(["item.*"])
        .sort("item.createdAt", "desc")
        .filter({
          "list.id": input.id,
        })
        .getMany();

      const filtered = content
        .filter((c) => !!c.item)
        .map((f) => {
          return {
            id: f.item!.id,
            text: f.item!.text ?? undefined,
            url: f.item!.url ?? undefined,
          };
        });

      return sendOutput({
        items: filtered,
      });
    },
  });
