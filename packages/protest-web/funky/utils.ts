export type HumanReadable<T> = {
  [K in keyof T]: T[K];
} & {};
