/** @format */

// app/fuzzy/fungsi-keanggotaan/components/FungsiModal.tsx
"use client";

import { useEffect } from "react";
import Modal from "@/components/UI/Modal";
import FungsiForm from "./FungsiForm";
import { useFungsiStore } from "@/stores/crud/fungsiStore";

export default function FungsiModal() {
  const {
    isModalOpen,
    isEditMode,
    fungsi,
    loading,
    parameterChoices,
    loadingChoices,
    closeModal,
    createFungsi,
    updateFungsi,
    fetchParameterChoices,
  } = useFungsiStore();

  useEffect(() => {
    if (isModalOpen && parameterChoices.length === 0) {
      fetchParameterChoices();
    }
  }, [isModalOpen, parameterChoices.length, fetchParameterChoices]);

  const handleSubmit = async (data: any) => {
    let success = false;

    if (isEditMode && fungsi?.id) {
      success = await updateFungsi(fungsi.id, data);
    } else {
      success = await createFungsi(data);
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
      title={
        isEditMode ? "Edit Fungsi Keanggotaan" : "Tambah Fungsi Keanggotaan"
      }
      size="lg"
    >
      <FungsiForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={fungsi}
        isEditMode={isEditMode}
        loading={loading}
        parameterChoices={parameterChoices}
        loadingChoices={loadingChoices}
      />
    </Modal>
  );
}
