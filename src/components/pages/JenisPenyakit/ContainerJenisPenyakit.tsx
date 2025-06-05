/** @format */
// container untuk halaman jenis penyakit
"use client";

import { useEffect, useState } from "react";
import { useJenisPenyakitStore } from "@/stores/crud/JenisPenyakitStore";
import JenisPenyakitCard from "@/components/pages/JenisPenyakit/JenisPenyakitCard";
import Modal from "@/components/UI/Modal";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { JenisPenyakit } from "@/types";
import { useRouter } from "next/navigation";
import JenisPenyakitForm from "./JenisPenyakitForm";

export default function ContainerJenisPenyakit() {
  const router = useRouter();
  const { jenisPenyakit, loading, deleteJenisPenyakit, fetchJenisPenyakits } =
    useJenisPenyakitStore();

  const [showForm, setShowForm] = useState(false);
  const [editingJenisPenyakit, setEditingJenisPenyakit] =
    useState<JenisPenyakit | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJenisPenyakits();
  }, [fetchJenisPenyakits]);

  const handleView = (jenisPenyakit: JenisPenyakit) => {
    router.push(`/admin/jenis-penyakit/${jenisPenyakit.id}`);
  };

  const handleEdit = (jenisPenyakit: JenisPenyakit) => {
    setEditingJenisPenyakit(jenisPenyakit);
    setShowForm(true);
  };

  const handleDelete = async (jenisPenyakit: JenisPenyakit) => {
    if (
      confirm(
        `Yakin ingin menghapus data ${
          jenisPenyakit.nm_penyakit || "jenis penyakit ini"
        }?`
      )
    ) {
      await deleteJenisPenyakit(jenisPenyakit.id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingJenisPenyakit(null);
    fetchJenisPenyakits();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Data Jenis Penyakit</h1>
          <p className="text-base-content/70 mt-1">
            Kelola data jenis penyakit dalam sistem
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline btn-sm"
          >
            <FunnelIcon className="h-4 w-4" />
            Filter
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Tambah Jenis Penyakit
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Jenis Penyakit Grid */}
          {jenisPenyakit.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jenisPenyakit.map((jenisPenyakit: JenisPenyakit) => (
                <JenisPenyakitCard
                  key={jenisPenyakit.id}
                  jenisPenyakit={jenisPenyakit}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-base-content/60 text-lg">
                Tidak ada data jenis penyakit
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary mt-4"
              >
                Tambah Jenis Penyakit Pertama
              </button>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingJenisPenyakit(null);
        }}
        title={
          editingJenisPenyakit
            ? "Edit Data Jenis Penyakit"
            : "Tambah Data Jenis Penyakit"
        }
        size="lg"
      >
        <JenisPenyakitForm
          initialData={editingJenisPenyakit || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingJenisPenyakit(null);
          }}
        />
      </Modal>
    </div>
  );
}
