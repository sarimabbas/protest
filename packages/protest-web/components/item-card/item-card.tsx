"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Textarea,
} from "@protest/shared";
import { Embed } from "../embed/embed";

interface ItemCardProps {
  id: string;
  url?: string;
  text?: string;
}

export const ItemCard = (props: ItemCardProps) => {
  return (
    <Card key={props.id} className="h-fit">
      <CardHeader className="flex items-center">
        <CardDescription>{props.id}</CardDescription>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        <Textarea
          disabled
          rows={5}
          className="w-full m-0 resize-none"
          defaultValue={props.text ?? ""}
        />
        {/* todo: fix responsive issues */}
        {props?.url && <Embed url={props.url} />}
      </CardContent>
    </Card>
  );
};
