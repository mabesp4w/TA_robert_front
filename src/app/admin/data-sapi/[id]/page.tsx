/** @format */
"use client";
import DataSapiDetailInfo from "@/components/pages/DataSapi/DataSapiDetailInfo";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useDataSapiStore } from "@/stores/crud/dataSapiStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function DataSapiDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { currentDataSapi, fetchDataSapiById, loading } = useDataSapiStore();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchDataSapiById(params.id);
    }
  }, [params.id, fetchDataSapiById]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentDataSapi) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-2xl mb-4">
                Data Sapi Tidak Ditemukan
              </h2>
              <p className="text-base-content/70 mb-6">
                Data sapi dengan ID tersebut tidak ditemukan atau telah dihapus.
              </p>
              <button
                onClick={() => router.push("/admin/sapi")}
                className="btn btn-primary"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali ke Daftar Sapi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/admin/sapi")}
            className="btn btn-ghost btn-sm"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Kembali
          </button>
          <h1 className="text-3xl font-bold">Detail Data Sapi</h1>
          <div></div>
        </div>

        {/* Detail Info */}
        <DataSapiDetailInfo sapi={currentDataSapi} />
      </div>
    </div>
  );
}

