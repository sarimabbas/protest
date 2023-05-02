import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { IPOSTBody, IPOSTResponse } from "~../shared/src";

const handler: PlasmoMessaging.MessageHandler<
  IPOSTBody,
  IPOSTResponse
> = async (req, res) => {
  const data = req.body?.data ?? [];

  try {
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
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return res.send({
        success: false,
        error: e.message,
        data: [],
      } as IPOSTResponse);
    }
  }
};

export default handler;
