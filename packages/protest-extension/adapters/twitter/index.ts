import type { IAdapter, IElement } from "~adapters/contract";

export const TwitterAdapter: IAdapter = {
  collect: () => {
    const nodes = document.querySelectorAll("article[data-testid='tweet']");
    const elements: IElement[] = [];
    nodes.forEach((node) => {
      const id = node.getAttribute("aria-labelledby");
      if (id) {
        elements.push({ id, domNode: node, hidden: false, fetched: false });
      }
    });
    return elements;
  },
  hide: (element) => {
    const node = document.querySelector(
      `article[data-testid='tweet'][aria-labelledby='${element.id}']`
    );
    if (node) {
      node.innerHTML =
        "<div style='background-color: white; color: black;'>tweet is filtered out</div>";
    }
  },
};
