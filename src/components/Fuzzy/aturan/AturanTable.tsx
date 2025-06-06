/** @format */

// app/fuzzy/aturan/components/AturanTable.tsx
"use client";

import { Edit, Trash2, Eye, TestTube } from "lucide-react";
import DataTable from "@/components/UI/DataTable";
import { Button } from "@/components/UI/Button";
import ProgressBar from "@/components/UI/ProgressBar";
import { AturanFuzzy } from "@/types/fuzzy";

interface AturanTableProps {
  data: AturanFuzzy[];
  loading: boolean;
  onEdit: (aturan: AturanFuzzy) => void;
  onDelete: (id: string) => void;
  onView?: (aturan: AturanFuzzy) => void;
  onTest?: (aturan: AturanFuzzy) => void;
}

export default function AturanTable({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  onTest,
}: AturanTableProps) {
  const formatKondisi = (kondisiIf: Record<string, string>) => {
    if (!kondisiIf || Object.keys(kondisiIf).length === 0) return "-";

    const conditions = Object.entries(kondisiIf).map(
      ([param, value]) => `${param}: ${value}`
    );

    return (
      conditions.slice(0, 2).join(", ") +
      (conditions.length > 2 ? ` (+${conditions.length - 2} lagi)` : "")
    );
  };

  const formatKesimpulan = (kesimpulanThen: Record<string, any>) => {
    if (!kesimpulanThen || Object.keys(kesimpulanThen).length === 0) return "-";

    const conclusions = Object.entries(kesimpulanThen).map(
      ([key, value]) => `${key}: ${value}`
    );

    return (
      conclusions.slice(0, 2).join(", ") +
      (conclusions.length > 2 ? ` (+${conclusions.length - 2} lagi)` : "")
    );
  };

  const getTingkatBahayaColor = (tingkat: string) => {
    switch (tingkat?.toLowerCase()) {
      case "ringan":
        return "badge-success";
      case "sedang":
        return "badge-warning";
      case "berat":
        return "badge-error";
      case "sangat_berat":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const columns = [
    {
      key: "nama_aturan",
      label: "Nama Aturan",
      render: (item: AturanFuzzy) => (
        <div>
          <div className="font-semibold">{item.nama_aturan}</div>
          <div className="text-xs text-gray-500">
            {item.kondisi_count ? `${item.kondisi_count} kondisi` : ""}
          </div>
        </div>
      ),
    },
    {
      key: "penyakit",
      label: "Penyakit Target",
      render: (item: AturanFuzzy) => (
        <div className="text-sm">
          <div className="font-medium">{item.penyakit_nama}</div>
          {item.penyakit_detail?.tingkat_bahaya && (
            <span
              className={`badge badge-xs ${getTingkatBahayaColor(
                item.penyakit_detail.tingkat_bahaya
              )}`}
            >
              {item.penyakit_detail.tingkat_bahaya.replace("_", " ")}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "kondisi_if",
      label: "Kondisi IF",
      render: (item: AturanFuzzy) => (
        <div className="text-xs max-w-xs">
          <div className="truncate" title={item.kondisi_readable}>
            {formatKondisi(item.kondisi_if)}
          </div>
        </div>
      ),
    },
    {
      key: "kesimpulan_then",
      label: "Kesimpulan THEN",
      render: (item: AturanFuzzy) => (
        <div className="text-xs max-w-xs">
          <div className="truncate">
            {formatKesimpulan(item.kesimpulan_then)}
          </div>
        </div>
      ),
    },
    {
      key: "bobot",
      label: "Bobot",
      render: (item: AturanFuzzy) => (
        <div className="w-24">
          <div className="text-xs font-semibold mb-1">
            {(item.bobot * 100).toFixed(0)}%
          </div>
          <ProgressBar
            value={item.bobot * 100}
            max={100}
            size="xs"
            color="primary"
            showPercentage={false}
          />
        </div>
      ),
    },
    {
      key: "aktif",
      label: "Status",
      render: (item: AturanFuzzy) => (
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
      render: (item: AturanFuzzy) => {
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
      render: (item: AturanFuzzy) => (
        <div className="flex gap-1">
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
          {onTest && (
            <Button
              size="xs"
              variant="accent"
              onClick={() => onTest(item)}
              title="Test Aturan"
            >
              <TestTube className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="xs"
            variant="warning"
            onClick={() => onEdit(item)}
            title="Edit Aturan"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="xs"
            variant="error"
            onClick={() => {
              if (
                window.confirm("Apakah Anda yakin ingin menghapus aturan ini?")
              ) {
                onDelete(item.id!);
              }
            }}
            title="Hapus Aturan"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: "w-40",
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
      emptyMessage="Belum ada data aturan fuzzy"
    />
  );
}
