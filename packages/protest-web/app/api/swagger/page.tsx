"use client";

import "swagger-ui-react/swagger-ui.css";
import SwaggerUI from "swagger-ui-react";
import { useEffect, useState } from "react";

const SwaggerPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <SwaggerUI url="/api/openapi.json" />;
};

export default SwaggerPage;
