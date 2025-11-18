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
  const { currentPemilik, fetchPemilikById, loading } = usePemilikStore();

  useEffect(() => {
    fetchPemilikById(params.id);
  }, [params.id, fetchPemilikById]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentPemilik) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-error">
          Data Pemilik Tidak Ditemukan
        </h2>
        <p className="text-base-content/60 mt-2">
          Data pemilik dengan ID {params.id} tidak ditemukan atau terjadi
          kesalahan.
        </p>
      </div>
    );
  }

  return <PemilikDetailInfo pemilik={currentPemilik} />;
}
