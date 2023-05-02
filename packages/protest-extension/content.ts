import { sendToBackground } from "@plasmohq/messaging";
import { type IPOSTBody, type IPOSTResponse } from "@protest/shared";
import throttle from "lodash.throttle";
import type { PlasmoCSConfig } from "plasmo";
import { getAdapterForDomain } from "~adapters";
import type { IElement } from "~adapters/contract";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

const elementMap: Record<string, IElement> = {};

const adapter = getAdapterForDomain();

const shouldHide = throttle(async () => {
  if (!adapter) {
    return;
  }

  // get all unfetched elements
  const unfetchedElements = Object.values(elementMap).filter((e) => !e.fetched);

  // send to server
  const body: IPOSTBody = {
    data: unfetchedElements.map((e) => ({
      id: e.id,
      content: e.domNode.innerText,
    })),
  };

  try {
    const resp: IPOSTResponse = await sendToBackground({
      name: "content-check",
      body,
    });
    if (resp.success) {
      resp.data.forEach((e) => {
        // mark fetched elements as fetched
        elementMap[e.id].fetched = true;
        // hide elements that are filtered out
        if (!e.show) {
          adapter.hide(elementMap[e.id]);
          elementMap[e.id].hidden = true;
          console.log("hiding element", e);
        }
      });
    } else {
      console.error(resp.error);
    }
  } catch (e) {
    console.error(e);
    return;
  }
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
  if (!adapter) {
    return;
  }

  console.log("on scroll");
  adapter.collect().forEach((e) => {
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
