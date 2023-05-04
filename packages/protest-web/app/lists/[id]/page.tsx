import { AddItemDialog } from "@/components/add-item-dialog";
import { ItemCard } from "@/components/item-card";
import { getXataClient } from "@/xata";

const xata = getXataClient();

const mutationDeleteItemOnList = async (itemOnListId: string) => {
  return xata.db.itemsOnLists.delete({
    id: itemOnListId,
  });
};

const ListPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const list = await xata.db.lists
    .filter({
      id: params.id,
    })
    .getFirst();

  const content = await xata.db.itemsOnLists
    .select(["item.*"])
    .filter({
      "list.id": params.id,
    })
    .getMany();

  const { id } = params;
  return (
    <div className="flex flex-col gap-8 md:px-8">
      <div className="flex justify-between flex-wrap items-center">
        <h1 className="text-xl font-bold">{list?.name}</h1>
        <AddItemDialog listId={id} />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {content.map((c) => {
          return (
            <ItemCard
              id={c.id}
              key={c.id}
              text={c.item?.text ?? ""}
              url={c.item?.url ?? ""}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ListPage;
