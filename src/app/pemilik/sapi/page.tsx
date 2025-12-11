/** @format */
"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/authStore";
import { pemilikCRUD, dataSapiCRUD } from "@/services/crudService";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { DataSapi, Pemilik } from "@/types";
import DataSapiCard from "@/components/pages/DataSapi/DataSapiCard";
import DataSapiForm from "@/components/pages/DataSapi/DataSapiForm";
import Modal from "@/components/UI/Modal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function PemilikSapiPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [sapiList, setSapiList] = useState<DataSapi[]>([]);
  const [loading, setLoading] = useState(true);
  const [pemilikId, setPemilikId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSapi, setEditingSapi] = useState<DataSapi | null>(null);

  useEffect(() => {
    const fetchSapiPemilik = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Ambil profile pemilik dari user
        const pemilikResponse = await pemilikCRUD.getMyProfile();
        
        // Handle response structure - extract Pemilik dari DetailResponse
        const pemilikData: Pemilik | null = pemilikResponse.results || null;
        const currentPemilikId = pemilikData?.id;

        if (!currentPemilikId) {
          console.error("Pemilik ID not found in response:", pemilikResponse);
          setLoading(false);
          return;
        }

        setPemilikId(currentPemilikId);

        // Ambil daftar sapi milik pemilik
        const sapiResponse = await pemilikCRUD.getDaftarSapi(currentPemilikId);
        
        // Handle response structure - bisa berupa { results: { daftar_sapi: [...] } } atau langsung array
        const sapiData = sapiResponse.results?.daftar_sapi || 
                        sapiResponse.results || 
                        sapiResponse || 
                        [];
        
        setSapiList(Array.isArray(sapiData) ? sapiData : []);
      } catch (error: any) {
        console.error("Error fetching sapi:", error);
        const errorMessage = error.response?.data?.message || error.message || "Gagal mengambil data sapi";
        toast.error(errorMessage);
        setSapiList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSapiPemilik();
  }, [user]);

  const handleViewSapi = (sapi: DataSapi) => {
    router.push(`/pemilik/sapi/${sapi.id}`);
  };

  const handleCreateSapi = () => {
    setEditingSapi(null);
    setShowForm(true);
  };

  const handleEditSapi = (sapi: DataSapi) => {
    setEditingSapi(sapi);
    setShowForm(true);
  };

  const handleDeleteSapi = async (sapi: DataSapi) => {
    if (confirm(`Yakin ingin menghapus data sapi ${sapi.nm_sapi || sapi.no_sapi || "ini"}?`)) {
      try {
        await dataSapiCRUD.delete(sapi.id);
        toast.success("Data sapi berhasil dihapus");
        // Refresh list
        if (pemilikId) {
          const sapiResponse = await pemilikCRUD.getDaftarSapi(pemilikId);
          const sapiData = sapiResponse.results?.daftar_sapi || 
                          sapiResponse.results || 
                          sapiResponse || 
                          [];
          setSapiList(Array.isArray(sapiData) ? sapiData : []);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Gagal menghapus data sapi";
        toast.error(errorMessage);
      }
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingSapi(null);
    
    // Refresh list
    if (pemilikId) {
      try {
        const sapiResponse = await pemilikCRUD.getDaftarSapi(pemilikId);
        const sapiData = sapiResponse.results?.daftar_sapi || 
                        sapiResponse.results || 
                        sapiResponse || 
                        [];
        setSapiList(Array.isArray(sapiData) ? sapiData : []);
      } catch (error) {
        console.error("Error refreshing sapi list:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sapi Saya</h1>
          <p className="text-base-content/70 mt-1">
            Kelola data sapi yang Anda miliki
          </p>
        </div>
        <button
          onClick={handleCreateSapi}
          className="btn btn-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Tambah Sapi
        </button>
      </div>

      {/* Sapi List */}
      {sapiList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sapiList.map((sapi: DataSapi) => (
            <DataSapiCard
              key={sapi.id}
              sapi={sapi}
              onView={handleViewSapi}
              onEdit={handleEditSapi}
              onDelete={handleDeleteSapi}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-base-content/60 text-lg">
            Anda belum memiliki sapi
          </p>
          <button
            onClick={handleCreateSapi}
            className="btn btn-primary mt-4"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah Sapi Pertama
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingSapi(null);
          }}
          title={editingSapi ? "Edit Data Sapi" : "Tambah Data Sapi"}
          size="lg"
        >
          <DataSapiForm
            initialData={
              editingSapi
                ? { 
                    ...editingSapi, 
                    pemilik: pemilikId || 
                    (typeof editingSapi.pemilik === 'string' 
                      ? editingSapi.pemilik 
                      : (editingSapi.pemilik as any)?.id) 
                  }
                : pemilikId
                ? { pemilik: pemilikId }
                : undefined
            }
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingSapi(null);
            }}
            disablePemilikSelect={true}
          />
        </Modal>
      )}
    </div>
  );
}

