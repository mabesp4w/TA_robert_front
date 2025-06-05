/** @format */
// components/pages/DataSapi/DataSapiDetailInfo.tsx

"use client";

import { DataSapi } from "@/types";
import {
  CakeIcon,
  ScaleIcon,
  HeartIcon,
  CalendarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";

interface DataSapiDetailInfoProps {
  sapi: DataSapi;
}

const DataSapiDetailInfo = ({ sapi }: DataSapiDetailInfoProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sehat":
        return "badge-success";
      case "sakit":
        return "badge-error";
      case "dalam_pengobatan":
        return "badge-warning";
      case "sembuh":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sehat":
        return "Sehat";
      case "sakit":
        return "Sakit";
      case "dalam_pengobatan":
        return "Dalam Pengobatan";
      case "sembuh":
        return "Sembuh";
      default:
        return status;
    }
  };

  const getJenkelText = (jenkel: string) => {
    return jenkel === "jantan" ? "Jantan" : "Betina";
  };

  const getJenkelIcon = (jenkel: string) => {
    return jenkel === "jantan" ? "♂" : "♀";
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <h2 className="card-title text-xl">
            {sapi.nm_sapi || "Tanpa Nama"}
            <span className="text-xl ml-2">{getJenkelIcon(sapi.jenkel)}</span>
          </h2>
          <div
            className={`badge ${getStatusColor(
              sapi.status_kesehatan
            )} badge-lg`}
          >
            {getStatusText(sapi.status_kesehatan)}
          </div>
        </div>

        <div className="space-y-4">
          {/* ID */}
          <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
            <span className="text-sm font-medium">ID Sapi</span>
            <span className="text-sm font-mono">
              {sapi?.id?.slice(0, 8)}...
            </span>
          </div>

          {/* Jenis Kelamin */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <HeartIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Jenis Kelamin</p>
              <p className="font-semibold capitalize">
                {getJenkelText(sapi.jenkel)}
              </p>
            </div>
          </div>

          {/* Umur */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <CakeIcon className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Umur</p>
              <p className="font-semibold">{sapi.umur_bulan} bulan</p>
            </div>
          </div>

          {/* Berat */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <ScaleIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Berat</p>
              <p className="font-semibold">{sapi.berat_kg} kg</p>
            </div>
          </div>

          {/* Tanggal Registrasi */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Tanggal Registrasi</p>
              <p className="font-semibold">
                {moment(sapi.tgl_registrasi).format("DD MMMM YYYY")}
              </p>
              <p className="text-xs text-base-content/60">
                {moment(sapi.tgl_registrasi).fromNow()}
              </p>
            </div>
          </div>

          {/* Catatan */}
          {sapi.catatan && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mt-1">
                <DocumentTextIcon className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-base-content/70">Catatan</p>
                <div className="bg-base-200 p-3 rounded-lg mt-1">
                  <p className="text-sm">{sapi.catatan}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timestamps */}
        {(sapi.created_at || sapi.updated_at) && (
          <div className="divider"></div>
        )}

        {sapi.created_at && (
          <div className="text-xs text-base-content/60">
            Dibuat: {moment(sapi.created_at).format("DD/MM/YYYY HH:mm")}
          </div>
        )}

        {sapi.updated_at && (
          <div className="text-xs text-base-content/60">
            Diperbarui: {moment(sapi.updated_at).format("DD/MM/YYYY HH:mm")}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSapiDetailInfo;
