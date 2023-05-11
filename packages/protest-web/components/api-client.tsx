import { makeFetcher } from "@sarim.garden/clover";

export const apiClient = makeFetcher({
  baseUrl: "http://localhost:3000",
});
