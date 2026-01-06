"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ClientRedirectProps {
  redirectTo: string;
}

export function ClientRedirect({ redirectTo }: ClientRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    // Small delay to ensure structured data is rendered for SEO
    router.replace(redirectTo);
  }, [router, redirectTo]);

  // Return minimal content while redirecting
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Redirecting...</p>
    </div>
  );
}

