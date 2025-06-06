/** @format */

// app/fuzzy/fungsi-keanggotaan/components/FungsiTable.tsx
"use client";

import { Edit, Trash2, Eye } from "lucide-react";
import DataTable from "@/components/UI/DataTable";
import { Button } from "@/components/UI/Button";
import { FungsiKeanggotaan } from "@/types/fuzzy";

interface FungsiTableProps {
  data: FungsiKeanggotaan[];
  loading: boolean;
  onEdit: (fungsi: FungsiKeanggotaan) => void;
  onDelete: (id: string) => void;
  onView?: (fungsi: FungsiKeanggotaan) => void;
}

export default function FungsiTable({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
}: FungsiTableProps) {
  const getFungsiTypeLabel = (type: string) => {
    switch (type) {
      case "trimf":
        return "Triangular";
      case "trapmf":
        return "Trapezoidal";
      case "gaussmf":
        return "Gaussian";
      default:
        return type;
    }
  };

  const formatParameterFungsi = (params: number[], type: string) => {
    if (!params || params.length === 0) return "-";

    switch (type) {
      case "trimf":
        return `[${params[0]}, ${params[1]}, ${params[2]}]`;
      case "trapmf":
        return `[${params[0]}, ${params[1]}, ${params[2]}, ${params[3]}]`;
      case "gaussmf":
        return `[μ=${params[0]}, σ=${params[1]}]`;
      default:
        return `[${params.join(", ")}]`;
    }
  };

  const columns = [
    {
      key: "nama_himpunan",
      label: "Nama Himpunan",
      render: (item: FungsiKeanggotaan) => (
        <div>
          <div className="font-semibold">{item.nama_himpunan}</div>
          <div className="text-xs text-gray-500">
            {item.parameter_nama || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "parameter_detail",
      label: "Parameter",
      render: (item: FungsiKeanggotaan) => (
        <div className="text-sm">
          <div className="font-medium">{item.parameter_nama}</div>
          <div className="text-gray-500">
            {item.parameter_tipe && (
              <span
                className={`badge badge-xs ${
                  item.parameter_tipe === "input"
                    ? "badge-primary"
                    : "badge-secondary"
                }`}
              >
                {item.parameter_tipe}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "tipe_fungsi",
      label: "Tipe Fungsi",
      render: (item: FungsiKeanggotaan) => (
        <div>
          <div className="font-medium">
            {getFungsiTypeLabel(item.tipe_fungsi)}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {formatParameterFungsi(item.parameter_fungsi, item.tipe_fungsi)}
          </div>
        </div>
      ),
    },
    {
      key: "warna",
      label: "Warna",
      render: (item: FungsiKeanggotaan) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: item.warna }}
          />
          <span className="text-xs font-mono text-gray-500">{item.warna}</span>
        </div>
      ),
    },
    {
      key: "aktif",
      label: "Status",
      render: (item: FungsiKeanggotaan) => (
        <span
          className={`badge ${item.aktif ? "badge-success" : "badge-error"}`}
        >
          {item.aktif ? "Aktif" : "Non-aktif"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (item: FungsiKeanggotaan) => {
        if (!item.created_at) return "-";
        return new Date(item.created_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      key: "actions",
      label: "Aksi",
      render: (item: FungsiKeanggotaan) => (
        <div className="flex gap-2">
          {onView && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onView(item)}
              title="Lihat Detail"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="xs"
            variant="warning"
            onClick={() => onEdit(item)}
            title="Edit Fungsi"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="xs"
            variant="error"
            onClick={() => {
              if (
                window.confirm(
                  "Apakah Anda yakin ingin menghapus fungsi keanggotaan ini?"
                )
              ) {
                onDelete(item.id!);
              }
            }}
            title="Hapus Fungsi"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: "w-32",
    },
  ];

  return (
    <DataTable
      data={data.map((item) => ({
        id: item.id!,
        ...item,
      }))}
      columns={columns}
      loading={loading}
      emptyMessage="Belum ada data fungsi keanggotaan"
    />
  );
}
