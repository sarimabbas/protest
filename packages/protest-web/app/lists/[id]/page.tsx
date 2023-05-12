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
      <div className="flex justify-between flex-wrap items-center">
        <h1 className="text-xl font-bold">{list?.name}</h1>
        <AddItemDialog listId={id} />
      </div>
      <CardboardProvider>
        <ItemCardGrid content={mapped} />
      </CardboardProvider>
    </div>
  );
};

export default ListPage;
