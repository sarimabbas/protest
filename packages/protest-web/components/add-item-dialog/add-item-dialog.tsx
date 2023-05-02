"use client";

import { Button, Input, Textarea } from "@protest/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@protest/shared";
import { useRef, useState } from "react";

interface AddItemDialogProps {
  onAddCallback?: (type: "text" | "url", value: string) => void;
}

export function AddItemDialog(props: AddItemDialogProps) {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");
  const urlRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onAdd = () => {
    if (props.onAddCallback !== undefined) {
      props.onAddCallback(
        activeTab,
        activeTab === "text" ? textRef.current!.value : urlRef.current!.value
      );
    }
    setIsOpen(false);
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
