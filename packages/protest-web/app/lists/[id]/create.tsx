"use client";
import { Button } from "@protest/shared";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export const CreateUI = ({ listId }: { listId: string }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  return (
    <div>
      <textarea ref={textAreaRef}></textarea>
      <Button
        variant="outline"
        onClick={async () => {
          if (textAreaRef.current) {
            await fetch(`/api/internal`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                listId,
                text: textAreaRef.current.value,
              }),
            });
            router.refresh();
          }
        }}
      >
        Add content
      </Button>
    </div>
  );
};
