/** @format */

// app/fuzzy/aturan/components/AturanModal.tsx
"use client";

import { useEffect } from "react";
import Modal from "@/components/UI/Modal";
import AturanForm from "./AturanForm";
import { useAturanStore } from "@/stores/crud/aturanStore";

export default function AturanModal() {
  const {
    isModalOpen,
    isEditMode,
    aturan,
    loading,
    penyakitChoices,
    loadingChoices,
    closeModal,
    createAturan,
    updateAturan,
    fetchPenyakitChoices,
  } = useAturanStore();

  useEffect(() => {
    if (isModalOpen && penyakitChoices.length === 0) {
      fetchPenyakitChoices();
    }
  }, [isModalOpen, penyakitChoices.length, fetchPenyakitChoices]);

  const handleSubmit = async (data: any) => {
    let success = false;

    if (isEditMode && aturan?.id) {
      success = await updateAturan(aturan.id, data);
    } else {
      success = await createAturan(data);
    }

    if (success) {
      closeModal();
    }

    return success;
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={isEditMode ? "Edit Aturan Fuzzy" : "Tambah Aturan Fuzzy"}
      size="xl"
    >
      <AturanForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={aturan}
        isEditMode={isEditMode}
        loading={loading}
        penyakitChoices={penyakitChoices}
        loadingChoices={loadingChoices}
      />
    </Modal>
  );
}
