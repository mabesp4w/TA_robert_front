/** @format */

// app/fuzzy/parameter/components/ParameterModal.tsx
"use client";

import Modal from "@/components/UI/Modal";
import ParameterForm from "./ParameterForm";
import { useParameterStore } from "@/stores/crud/parameterStore";

export default function ParameterModal() {
  const {
    isModalOpen,
    isEditMode,
    parameter,
    loading,
    closeModal,
    createParameter,
    updateParameter,
  } = useParameterStore();

  const handleSubmit = async (data: any) => {
    let success = false;

    if (isEditMode && parameter?.id) {
      success = await updateParameter(parameter.id, data);
    } else {
      success = await createParameter(data);
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
      title={isEditMode ? "Edit Parameter Fuzzy" : "Tambah Parameter Fuzzy"}
      size="lg"
    >
      <ParameterForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={parameter}
        isEditMode={isEditMode}
        loading={loading}
      />
    </Modal>
  );
}
