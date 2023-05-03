import { Embed } from "@/components/embed";
import { getXataClient } from "@/xata";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Textarea,
} from "@protest/shared";
import { AddItemDialog } from "@/components/add-item-dialog";

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
            <Card key={c.id} className="h-fit">
              <CardHeader className="flex items-center">
                <CardDescription>{c.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  disabled
                  rows={5}
                  className="w-full m-0 resize-none"
                  defaultValue={c.item?.text ?? ""}
                />
                {/* todo: fix responsive issues */}
                {c.item?.url && <Embed url={c.item.url} />}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ListPage;
