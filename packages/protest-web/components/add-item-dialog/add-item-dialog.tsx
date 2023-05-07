"use client";

import { createContent } from "@/actions";
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
import { useState } from "react";

interface AddItemDialogProps {
  listId: string;
  onAddCallback?: (type: "text" | "url", value: string) => void;
}

export function AddItemDialog(props: AddItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

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
        <Tabs className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          <form action={createContent}>
            <TabsContent value="text">
              <Textarea
                name="text"
                placeholder="The big brown fox jumped over the lazy dog..."
              />
            </TabsContent>
            <TabsContent value="url">
              <Input
                name="url"
                type="url"
                placeholder="https://twitter.com/cat/status/123456"
              />
            </TabsContent>
          </form>
        </Tabs>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
