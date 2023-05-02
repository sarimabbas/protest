import type { IAdapter } from "./contract";
import { TwitterAdapter } from "./twitter";

export const getAdapterForDomain = (): IAdapter | undefined => {
  const domain = window.location.hostname;

  switch (domain) {
    case "twitter.com":
      return TwitterAdapter;
    default:
      return undefined;
  }
};
