import { getXataClient } from "@/xata";

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
      <br />
      <div>{JSON.stringify(content, null, 2)}</div>
    </div>
  );
};

export default ListPage;
