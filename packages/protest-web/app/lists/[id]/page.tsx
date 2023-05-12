import { AddItemDialog } from "@/components/add-item-dialog";
import { ItemCardGrid } from "@/components/item-card-grid";
import { getXataClient } from "@/xata";
import { CardboardProvider } from "@sarim.garden/cardboard";

const xata = getXataClient();

const ListPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { id } = params;
  const list = await xata.db.lists
    .filter({
      id,
    })
    .getFirst();

  const content = await xata.db.itemsOnLists
    .select(["item.*"])
    .sort("item.createdAt", "desc")
    .filter({
      "list.id": id,
    })
    .getMany();

  const mapped = content.map((c) => ({
    id: c.id,
    item: {
      text: c.item?.text ?? "",
      url: c.item?.url ?? "",
    },
  }));

  return (
    <div className="flex flex-col gap-8 md:px-8">
      <h1 className="text-2xl font-bold">{list?.name}</h1>
      <div className="flex justify-between flex-wrap items-center">
        <h2 className="text-xl font-semibold">Content</h2>
        <AddItemDialog listId={id} />
      </div>
      <div className="max-h-[800px] overflow-y-auto rounded-md border-yellow-400 p-4 border-8">
        <CardboardProvider>
          <ItemCardGrid content={mapped} />
        </CardboardProvider>
      </div>
    </div>
  );
};

export default ListPage;
