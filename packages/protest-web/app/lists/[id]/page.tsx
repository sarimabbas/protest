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

const ListPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const xata = getXataClient();

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
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold">{list?.name}</h1>
      <AddItemDialog listId={id} />
      <div className="grid grid-cols-3 gap-4">
        {content.map((c) => {
          return (
            <Card key={c.id}>
              <CardHeader>
                <CardDescription>{c.id}</CardDescription>
                <CardContent className="p-0">
                  {c.item?.url && <Embed url={c.item.url} />}
                  <Textarea
                    disabled
                    rows={5}
                    className="w-full m-0 resize-none"
                  >
                    {c.item?.text}
                  </Textarea>
                </CardContent>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ListPage;
