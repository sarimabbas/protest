import { sendToBackground } from "@plasmohq/messaging";
import { type IPOSTResponse } from "@protest/shared";
import throttle from "lodash.throttle";
import type { PlasmoCSConfig } from "plasmo";
import type { IElement } from "~adapters/contract";
import { TwitterAdapter } from "~adapters/twitter";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

const elementMap: Record<string, IElement> = {};

const shouldHide = throttle(async () => {
  // get all unfetched elements
  const unfetchedElements = Object.values(elementMap).filter((e) => !e.fetched);

  // send to server
  const resp: IPOSTResponse = await sendToBackground({
    name: "content-check",
    body: {
      inputs: unfetchedElements.map((e) => ({
        id: e.id,
        text: e.domNode.innerText,
      })),
    },
  });

  console.log({ resp });

  resp.data.forEach((e) => {
    // mark fetched elements as fetched
    elementMap[e.id].fetched = true;

    // hide elements that are filtered out
    if (!e.show) {
      TwitterAdapter.hide(elementMap[e.id]);
      elementMap[e.id].hidden = true;
      console.log("hiding element", e);
    }
  });
}, 1500);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Do something when the element becomes visible in the viewport
      console.log("Element is visible!");
    }
  });
});

window.addEventListener("scroll", () => {
  console.log("on scroll");
  TwitterAdapter.collect().forEach((e) => {
    if (e.id in elementMap) {
      return;
    }
    elementMap[e.id] = e;
  });

  console.log("calling shouldHide");
  shouldHide();
});

// Observe all existing elements
// container.querySelectorAll(".my-element").forEach((element) => {
//   observer.observe(element);
// });
