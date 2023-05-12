"use client";

import { ItemCard } from "@/components/item-card";
import { Masonry } from "react-plock";

interface ItemCardGridProps {
  content: {
    id: string;
    item?: {
      text?: string;
      url?: string;
    };
  }[];
}
export const ItemCardGrid = (props: ItemCardGridProps) => {
  const { content } = props;
  return (
    <Masonry
      items={content}
      render={(c) => (
        <ItemCard
          id={c.id}
          key={c.id}
          text={c.item?.text ?? ""}
          url={c.item?.url ?? ""}
        />
      )}
      config={{
        columns: [1, 2, 3],
        gap: [24, 12, 6],
        media: [640, 768, 1024],
      }}
    />
  );
};
