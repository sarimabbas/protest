"use client";

import dynamic from "next/dynamic";
import React from "react";
import Microlink from "@microlink/react";

// const ReactEmbed = dynamic(() =>
//   import("react-embed").then((mod) => mod.default)
// );

export const Embed = ({ url }: { url: string }) => {
  return <Microlink url={url} />;
};
