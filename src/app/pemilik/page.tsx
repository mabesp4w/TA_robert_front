/** @format */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PemilikPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pemilik/dashboard");
  }, [router]);

  return null;
}

