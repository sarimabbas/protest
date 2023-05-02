import { getXataClient } from "@/xata";
import { CreateUI } from "./create";

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

  const content = await xata.db.content
    .filter({
      "list.id": params.id,
    })
    .getMany();

  const { id } = params;
  return (
    <div>
      <h1>{list?.name}</h1>
      <h2>Add content</h2>
      <CreateUI listId={id} />
      <br />
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </div>
  );
};

export default ListPage;
