import type { PlasmoCSConfig } from "plasmo";
import type { IElement } from "~adapters/contract";
import { TwitterAdapter } from "~adapters/twitter";
import throttle from "lodash.throttle";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

const elementMap: Record<string, IElement> = {};

const shouldHide = throttle(() => {
  Object.values(elementMap).forEach((e) => {
    e.fetched = true;
    if (e.domNode.innerHTML.toLowerCase().includes("bluesky")) {
      TwitterAdapter.hide(e);
      console.log("hiding element", e);
      e.hidden = true;
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
  TwitterAdapter.collect().forEach((e) => {
    if (e.id in elementMap) {
      return;
    }
    elementMap[e.id] = e;
  });
  shouldHide();
});

// Observe all existing elements
// container.querySelectorAll(".my-element").forEach((element) => {
//   observer.observe(element);
// });
