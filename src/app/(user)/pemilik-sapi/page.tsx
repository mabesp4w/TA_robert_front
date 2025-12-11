/** @format */
"use client";

import PemilikCard from "@/components/pages/Pemilik/PemilikCard";
import { usePemilikStore } from "@/stores/crud/pemilikStore";
import { Pemilik } from "@/types";
import React, { useEffect } from "react";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

const PemilikSapiPage = () => {
  const { fetchPemiliks, pemiliks, loading } = usePemilikStore();

  useEffect(() => {
    fetchPemiliks();
  }, [fetchPemiliks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Pemilik Sapi</h1>
        <p className="text-base-content/70 mt-1">
          Daftar semua pemilik sapi dalam sistem
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : pemiliks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pemiliks.map((pemilik: Pemilik) => (
            <PemilikCard key={pemilik.id} pemilik={pemilik} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-base-content/60 text-lg">
            Tidak ada data pemilik
          </p>
        </div>
      )}
    </div>
  );
};

export default PemilikSapiPage;

