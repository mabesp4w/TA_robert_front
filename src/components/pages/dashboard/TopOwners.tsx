/** @format */

// components/dashboard/TopOwners.tsx
import React from "react";
import { Building2, User, Users } from "lucide-react";
import { TopPemilik } from "@/types/dashboard";

interface TopOwnersProps {
  data: TopPemilik[];
}

export const TopOwners: React.FC<TopOwnersProps> = ({ data }) => {
  const getOwnerIcon = (jenis: string) => {
    switch (jenis.toLowerCase()) {
      case "perusahaan":
        return <Building2 className="w-5 h-5 text-primary" />;
      case "koperasi":
        return <Users className="w-5 h-5 text-success" />;
      case "perorangan":
        return <User className="w-5 h-5 text-secondary" />;
      default:
        return <User className="w-5 h-5 text-secondary" />;
    }
  };

  const getOwnerBadgeColor = (jenis: string) => {
    switch (jenis.toLowerCase()) {
      case "perusahaan":
        return "badge-primary";
      case "koperasi":
        return "badge-success";
      case "perorangan":
        return "badge-secondary";
      default:
        return "badge-neutral";
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return "text-error";
    if (percentage >= 60) return "text-warning";
    if (percentage >= 40) return "text-info";
    return "text-success";
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title text-lg font-semibold mb-4">
          Top Pemilik Sapi
        </h3>
        <div className="space-y-4">
          {data.map((owner, index) => (
            <div
              key={owner.id}
              className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    #{index + 1}
                  </span>
                  {getOwnerIcon(owner.jenis_pemilik)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-base-content">
                      {owner.nm_pemilik}
                    </h4>
                    <span
                      className={`badge badge-sm ${getOwnerBadgeColor(
                        owner.jenis_pemilik
                      )}`}
                    >
                      {owner.jenis_pemilik}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-base-content/70">
                    <span>Total: {owner.total_sapi} sapi</span>
                    <span className="text-success">
                      Sehat: {owner.sapi_sehat}
                    </span>
                    {owner.sapi_sakit > 0 && (
                      <span className="text-error">
                        Sakit: {owner.sapi_sakit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-lg font-bold ${getUtilizationColor(
                    owner.utilisasi_persen
                  )}`}
                >
                  {owner.utilisasi_persen.toFixed(1)}%
                </div>
                <div className="text-xs text-base-content/60">
                  {owner.total_sapi}/{owner.max_sapi}
                </div>
                <div className="w-20 h-2 bg-base-300 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      owner.utilisasi_persen >= 80
                        ? "bg-error"
                        : owner.utilisasi_persen >= 60
                        ? "bg-warning"
                        : owner.utilisasi_persen >= 40
                        ? "bg-info"
                        : "bg-success"
                    }`}
                    style={{
                      width: `${Math.min(owner.utilisasi_persen, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
