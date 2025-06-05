/** @format */
"use client";
import PemilikDetailInfo from "@/components/pages/Pemilik/PemilikDetailInfo";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { usePemilikStore } from "@/stores/crud/pemilikStore";
import { useEffect } from "react";

export default function PemilikDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { currentPemilik, fetchPemilikById } = usePemilikStore();

  useEffect(() => {
    fetchPemilikById(params.id);
  }, [params.id]);

  return currentPemilik ? (
    <PemilikDetailInfo pemilik={currentPemilik} />
  ) : (
    <LoadingSpinner />
  );
}
