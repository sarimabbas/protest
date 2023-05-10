import { makeFetcher } from "funky";

export const apiClient = makeFetcher({
  baseUrl: "http://localhost:3000",
});
