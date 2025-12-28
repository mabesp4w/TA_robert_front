/** @format */
"use client";
import JenisPenyakitDetailInfo from "@/components/pages/JenisPenyakit/JenisPenyakitDetailInfo";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useJenisPenyakitStore } from "@/stores/crud/JenisPenyakitStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function JenisPenyakitDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { currentJenisPenyakit, fetchJenisPenyakitById, loading } =
    useJenisPenyakitStore();
  const router = useRouter();
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  // Semua hooks harus dipanggil sebelum conditional returns
  useEffect(() => {
    let isMounted = true;
    
    const resolveParams = async () => {
      try {
        const resolvedParams = params instanceof Promise ? await params : params;
        if (isMounted && resolvedParams?.id) {
          setResolvedId(resolvedParams.id);
          await fetchJenisPenyakitById(resolvedParams.id);
        }
      } catch (error) {
        console.error("Error resolving params or fetching data:", error);
      }
    };
    
    resolveParams();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug: Log current state - harus setelah semua hooks
  useEffect(() => {
    if (currentJenisPenyakit) {
      console.log("Current Jenis Penyakit:", currentJenisPenyakit);
    }
  }, [currentJenisPenyakit]);

  // Conditional returns setelah semua hooks
  if (loading && !currentJenisPenyakit) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-4xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!loading && !currentJenisPenyakit && resolvedId) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-2xl mb-4">
                Data Jenis Penyakit Tidak Ditemukan
              </h2>
              <p className="text-base-content/70 mb-6">
                Data jenis penyakit dengan ID tersebut tidak ditemukan atau telah dihapus.
              </p>
              <button
                onClick={() => router.push("/admin/jenis-penyakit")}
                className="btn btn-primary"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali ke Daftar Jenis Penyakit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentJenisPenyakit) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/admin/jenis-penyakit")}
            className="btn btn-ghost btn-sm"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Kembali
          </button>
          <h1 className="text-3xl font-bold">Detail Jenis Penyakit</h1>
          <div></div>
        </div>

        {/* Debug Info - hanya tampilkan jika ada masalah */}
        {process.env.NODE_ENV === 'development' && !currentJenisPenyakit.nm_penyakit && (
          <div className="alert alert-warning">
            <p className="font-bold">Debug Info:</p>
            <pre className="text-xs overflow-auto max-h-64">
              {JSON.stringify(currentJenisPenyakit, null, 2)}
            </pre>
          </div>
        )}

        {/* Detail Info */}
        <JenisPenyakitDetailInfo jenisPenyakit={currentJenisPenyakit} />
      </div>
    </div>
  );
}

