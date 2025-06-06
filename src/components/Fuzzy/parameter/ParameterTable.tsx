/** @format */

// app/fuzzy/parameter/components/ParameterTable.tsx
"use client";

import { Edit, Trash2, Eye } from "lucide-react";
import DataTable from "@/components/UI/DataTable";
import { Button } from "@/components/UI/Button";
import { ParameterFuzzy } from "@/types/fuzzy";

interface ParameterTableProps {
  data: ParameterFuzzy[];
  loading: boolean;
  onEdit: (parameter: ParameterFuzzy) => void;
  onDelete: (id: string) => void;
  onView?: (parameter: ParameterFuzzy) => void;
}

export default function ParameterTable({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
}: ParameterTableProps) {
  const columns = [
    {
      key: "nama_parameter",
      label: "Nama Parameter",
      render: (item: ParameterFuzzy) => (
        <div>
          <div className="font-semibold">{item.nama_parameter}</div>
          {item.deskripsi && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {item.deskripsi}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "tipe",
      label: "Tipe",
      render: (item: ParameterFuzzy) => (
        <span
          className={`badge ${
            item.tipe === "input" ? "badge-primary" : "badge-secondary"
          }`}
        >
          {item.tipe === "input" ? "Input" : "Output"}
        </span>
      ),
    },
    {
      key: "range_display",
      label: "Range Nilai",
      render: (item: ParameterFuzzy) => (
        <div className="text-sm">
          <div className="font-mono">
            {item.nilai_min} - {item.nilai_max}
          </div>
          {item.satuan && <div className="text-gray-500">({item.satuan})</div>}
        </div>
      ),
    },
    {
      key: "aktif",
      label: "Status",
      render: (item: ParameterFuzzy) => (
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
      render: (item: ParameterFuzzy) => {
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
      render: (item: ParameterFuzzy) => (
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
            title="Edit Parameter"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="xs"
            variant="error"
            onClick={() => {
              if (
                window.confirm(
                  "Apakah Anda yakin ingin menghapus parameter ini?"
                )
              ) {
                onDelete(item.id!);
              }
            }}
            title="Hapus Parameter"
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
      data={data as any}
      columns={columns as any}
      loading={loading}
      emptyMessage="Belum ada data parameter fuzzy"
    />
  );
}
