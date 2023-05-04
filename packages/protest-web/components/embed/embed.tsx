"use client";

import React from "react";
import { Cardboard } from "@sarim.garden/cardboard";

export const Embed = ({ url }: { url: string }) => {
  return <Cardboard url={url} />;
};
