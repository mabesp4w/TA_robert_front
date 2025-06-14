/** @format */
"use client";
import PemilikCard from "@/components/pages/Pemilik/PemilikCard";
import { usePemilikStore } from "@/stores/crud/pemilikStore";
import { Pemilik } from "@/types";
import React, { useEffect } from "react";

const PemilikPage = () => {
  const { fetchPemiliks, pemiliks } = usePemilikStore();

  useEffect(() => {
    fetchPemiliks();
  }, [fetchPemiliks]);

  console.log({ pemiliks });
  return (
    <main className="mt-4">
      <h1 className="text-3xl font-bold">Data Pemilik Sapi</h1>

      {pemiliks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pemiliks.map((pemilik: Pemilik) => (
            <PemilikCard key={pemilik.id} pemilik={pemilik} />
          ))}
        </div>
      )}
    </main>
  );
};

export default PemilikPage;
