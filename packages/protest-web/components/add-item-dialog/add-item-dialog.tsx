"use client";

import { addItem } from "@/app/actions";
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
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useZact } from "zact/client";

interface AddItemDialogProps {
  listId: string;
  onAddCallback?: (type: "text" | "url", value: string) => void;
}

export function AddItemDialog(props: AddItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const urlRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { mutate, isLoading } = useZact(addItem);

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
          <TabsContent value="text">
            <Textarea
              ref={textRef}
              placeholder="The big brown fox jumped over the lazy dog..."
            />
          </TabsContent>
          <TabsContent value="url">
            <Input
              ref={urlRef}
              type="url"
              placeholder="https://twitter.com/cat/status/123456"
            />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            type="submit"
            onClick={async () => {
              const text = textRef.current?.value;
              const url = urlRef.current?.value;
              await mutate({
                listId: props.listId,
                text,
                url,
              });
              setIsOpen(false);
            }}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
