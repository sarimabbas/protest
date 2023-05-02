"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export const ReactEmbed = dynamic(() =>
  import("react-embed").then((mod) => mod.default)
);

export const Embed = ({ url }: { url: string }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    return <ReactEmbed url={url} />;
  }

  return null;
};
