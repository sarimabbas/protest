"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@protest/shared";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface AddItemDialogProps {
  listId: string;
  onAddCallback?: (type: "text" | "url", value: string) => void;
}

const addItemMutation = async ({
  listId,
  text,
  url,
}: {
  listId: string;
  text?: string;
  url?: string;
}) => {
  return fetch(`/api/internal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listId,
      text,
      url,
    }),
  });
};

export function AddItemDialog(props: AddItemDialogProps) {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");
  const urlRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onAdd = async () => {
    await addItemMutation({
      listId: props.listId,
      text: textRef.current?.value,
      url: urlRef.current?.value,
    });
    setIsOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          Add item
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle>Add item</DialogTitle>
          <DialogDescription>
            Copy text directly, or add via link
          </DialogDescription>
        </DialogHeader>
        <Tabs
          className="w-[400px]"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <Textarea
              ref={textRef}
              placeholder="The big brown fox jumped over the lazy dog..."
            />
          </TabsContent>
          <TabsContent value="url">
            <Input
              type="url"
              ref={urlRef}
              placeholder="https://twitter.com/cat/status/123456"
            />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="submit" onClick={onAdd}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
