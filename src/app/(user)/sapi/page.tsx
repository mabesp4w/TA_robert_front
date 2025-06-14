/** @format */
"use client";
import DataSapiCard from "@/components/pages/DataSapi/DataSapiCard";
import { useDataSapiStore } from "@/stores/crud/dataSapiStore";
import { DataSapi } from "@/types";
import React, { useEffect } from "react";

const SapiPage = () => {
  const { fetchDataSapis, dataSapi } = useDataSapiStore();

  useEffect(() => {
    fetchDataSapis();
  }, [fetchDataSapis]);

  console.log({ dataSapi });
  return (
    <main className="mt-4">
      <h1 className="text-3xl font-bold">Data Sapi</h1>

      {dataSapi.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataSapi.map((sapi: DataSapi) => (
            <DataSapiCard key={sapi.id} sapi={sapi} />
          ))}
        </div>
      )}
    </main>
  );
};

export default SapiPage;
