// Generated by Xata Codegen 0.23.5. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "items",
    columns: [
      { name: "embeddingAda", type: "vector", vector: { dimension: 1536 } },
      { name: "text", type: "text" },
      { name: "url", type: "string" },
      {
        name: "createdAt",
        type: "datetime",
        notNull: true,
        defaultValue: "now",
      },
    ],
  },
  {
    name: "lists",
    columns: [
      { name: "name", type: "string" },
      { name: "user", type: "link", link: { table: "users" } },
    ],
  },
  {
    name: "itemsOnLists",
    columns: [
      { name: "list", type: "link", link: { table: "lists" } },
      { name: "item", type: "link", link: { table: "items" } },
    ],
  },
  {
    name: "users",
    columns: [{ name: "clerkId", type: "string", unique: true }],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Items = InferredTypes["items"];
export type ItemsRecord = Items & XataRecord;

export type Lists = InferredTypes["lists"];
export type ListsRecord = Lists & XataRecord;

export type ItemsOnLists = InferredTypes["itemsOnLists"];
export type ItemsOnListsRecord = ItemsOnLists & XataRecord;

export type Users = InferredTypes["users"];
export type UsersRecord = Users & XataRecord;

export type DatabaseSchema = {
  items: ItemsRecord;
  lists: ListsRecord;
  itemsOnLists: ItemsOnListsRecord;
  users: UsersRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL: "https://Protest-37ev59.us-east-1.xata.sh/db/protest-example",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
