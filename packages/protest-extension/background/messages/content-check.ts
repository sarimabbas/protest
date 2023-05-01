import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { IPOSTBody, IPOSTResponse } from "~../shared/src";

const handler: PlasmoMessaging.MessageHandler<
  IPOSTBody,
  IPOSTResponse
> = async (req, res) => {
  const data = req.body?.data ?? [];

  const fetchResponse = await fetch(
    "http://localhost:3000/api/lists/rec_ch5mkt9nghoiu7rvsb2g",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
      } satisfies IPOSTBody),
    }
  );

  const responseBody = (await fetchResponse.json()) as IPOSTResponse;

  return res.send(responseBody);
};

export default handler;
