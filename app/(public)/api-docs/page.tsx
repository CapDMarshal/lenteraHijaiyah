"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css"; // Import the CSS globally for swagger
import { useEffect, useState } from "react";

// Karena Swagger-UI-React ini heavily bergantung pada document/window object browser,
// kita load secara dynamic dengan men-disable SSR (Server Side Rendering).
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-10 text-center">Loading API Docs...</div>;

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Lentera Hijaiyah API Explorer</h1>
        {/* URL menunjuk langsung ke file statis di dalam folder public/swagger.yaml */}
        <SwaggerUI url="/swagger.yaml" />
      </div>
    </div>
  );
}
