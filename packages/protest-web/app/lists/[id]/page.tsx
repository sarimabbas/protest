import { getXataClient } from "@/xata";

const ListPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const xata = getXataClient();
  const content = await xata.db.content
    .filter({
      "list.id": params.id,
    })
    .getMany();

  const { id } = params;
  return (
    <div>
      <h1>List {id}</h1>
      <div>{JSON.stringify(content, null, 2)}</div>
    </div>
  );
};

export default ListPage;
