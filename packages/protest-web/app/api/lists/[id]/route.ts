import { openAI } from "@/openai";
import { getXataClient } from "@/xata";
import { IOutputItem, IPOSTResponse, ZPOSTBody } from "@protest/shared";
import { NextRequest, NextResponse } from "next/server";

const xata = getXataClient();

export const POST = async (
  request: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) => {
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

  console.log({ sarimparamid: params.id });

  // this is the input data
  const { data } = zodParsedBody.data;

  // todo: RULE: keyword search

  // RULE: vector search
  const embeddingsResponse = await openAI.createEmbedding({
    input: data.map((d) => d.content),
    model: "text-embedding-ada-002",
  });
  const embeddings = embeddingsResponse.data.data.map((d) => d.embedding);
  const decisions = await Promise.all(
    embeddings.map(async (em, i) => {
      const vecSearch = await xata.db.content.vectorSearch("embedding", em, {
        filter: {
          redundantListId: params.id,
        },
      });
      console.log({
        inputText: data[i].content.slice(0, 100),
        vecSearch: vecSearch.map((v) => ({
          content: v.text?.slice(0, 100),
          ...v.getMetadata(),
        })),
      });
      return (vecSearch?.[0].getMetadata().score ?? 0) < 1.8;
    })
  );

  // todo: RULE: general LLM prompt

  // the algorithm
  const outputs: IOutputItem[] = data.map((input, idx) => ({
    id: input.id,
    show: decisions[idx],
  }));

  // send back to client
  const normalResponse: IPOSTResponse = {
    data: outputs,
    success: true,
  };
  return NextResponse.json(normalResponse);
};
