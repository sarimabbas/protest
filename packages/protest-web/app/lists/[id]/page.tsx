"use client";

import { listGETTypes } from "@/app/api/lists/[id]/route";
import { AddItemDialog } from "@/components/add-item-dialog";
import { apiClient } from "@/components/api-client";
import { ItemCard } from "@/components/item-card";
import { CardboardProvider } from "@sarim.garden/cardboard";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ListPage = () => {
  const { id } = useParams();
  const { data } = useQuery({
    queryFn: async () =>
      apiClient<typeof listGETTypes>({
        input: {
          id,
        },
        method: "GET",
        path: `/api/lists/:id`,
      }),
    queryKey: ["list", id],
    enabled: !!id,
  });

  return (
    <div className="flex flex-col gap-8 md:px-8">
      <div className="flex justify-between flex-wrap items-center">
        <h1 className="text-xl font-bold">{data?.list?.name}</h1>
        <AddItemDialog listId={id} />
      </div>
      <CardboardProvider>
        <div className="grid md:grid-cols-3 gap-4">
          {data?.items.map((c) => {
            return (
              <ItemCard
                id={c.id}
                key={c.id}
                text={c.text ?? ""}
                url={c.url ?? ""}
              />
            );
          })}
        </div>
      </CardboardProvider>
    </div>
  );
};

export default ListPage;
