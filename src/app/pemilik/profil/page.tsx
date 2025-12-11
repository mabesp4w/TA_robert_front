/** @format */
"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/authStore";
import { pemilikCRUD } from "@/services/crudService";
import { Pemilik } from "@/types";
import { useForm } from "react-hook-form";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import moment from "moment";

export default function PemilikProfilPage() {
  const { user } = useAuthStore();
  const [pemilikData, setPemilikData] = useState<Pemilik | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profil" | "password">("profil");

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<{
    old_password: string;
    new_password: string;
    confirm_password: string;
  }>();

  useEffect(() => {
    const fetchProfil = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await pemilikCRUD.getMyProfile();
        // Extract Pemilik data from DetailResponse
        const data: Pemilik | null = response.results || null;
        if (data) {
          setPemilikData(data);
        }
      } catch (error: any) {
        console.error("Error fetching profil:", error);
        toast.error("Gagal mengambil data profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, [user]);

  const onSubmitPassword = async (data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    if (!pemilikData) return;

    if (data.new_password !== data.confirm_password) {
      toast.error("Password baru dan konfirmasi password tidak sama");
      return;
    }

    try {
      setUpdating(true);
      // Cek apakah ada endpoint khusus untuk change password pemilik
      // Jika tidak, gunakan update dengan password
      await pemilikCRUD.update(pemilikData.id, {
        ...pemilikData,
        password: data.new_password,
        old_password: data.old_password,
      } as any);
      
      resetPassword();
      toast.success("Password berhasil diubah");
    } catch (error: any) {
      console.error("Error changing password:", error);
      const errorMessage = error.response?.data?.message || "Gagal mengubah password";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const newPassword = watchPassword("new_password");

  const getJenisPemilikLabel = (jenis: string) => {
    const labels: { [key: string]: string } = {
      perorangan: "Perorangan",
      kelompok: "Kelompok",
      koperasi: "Koperasi",
      perusahaan: "Perusahaan",
    };
    return labels[jenis] || jenis;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!pemilikData) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60 text-lg">
          Gagal memuat data profil
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profil Saya</h1>
        <p className="text-base-content/70 mt-1">
          Kelola informasi profil dan keamanan akun Anda
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === "profil" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("profil")}
        >
          Data Profil
        </button>
        <button
          className={`tab ${activeTab === "password" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Ubah Password
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profil" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Informasi Profil</h2>
            <div className="space-y-6">
              {/* Nama Pemilik */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Nama Pemilik</span>
                </label>
                <div className="input input-bordered bg-base-200">
                  {pemilikData.nm_pemilik || "-"}
                </div>
              </div>

              {/* Email dan No HP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <div className="input input-bordered bg-base-200">
                    {pemilikData.email || "-"}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">No. HP</span>
                  </label>
                  <div className="input input-bordered bg-base-200">
                    {pemilikData.no_hp || "-"}
                  </div>
                </div>
              </div>

              {/* Alamat */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Alamat</span>
                </label>
                <div className="textarea textarea-bordered bg-base-200 min-h-[100px]">
                  {pemilikData.alamat || "-"}
                </div>
              </div>

              {/* Jenis Pemilik dan Max Sapi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Jenis Pemilik</span>
                  </label>
                  <div className="input input-bordered bg-base-200">
                    {getJenisPemilikLabel(pemilikData.jenis_pemilik)}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Maksimal Sapi</span>
                  </label>
                  <div className="input input-bordered bg-base-200">
                    {pemilikData.max_sapi || "-"}
                  </div>
                </div>
              </div>

              {/* Catatan */}
              {pemilikData.catatan && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Catatan</span>
                  </label>
                  <div className="textarea textarea-bordered bg-base-200 min-h-[100px]">
                    {pemilikData.catatan}
                  </div>
                </div>
              )}

              {/* Info Tambahan */}
              <div className="divider"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Tanggal Registrasi</span>
                  </label>
                  <div className="input input-bordered bg-base-200">
                    {pemilikData.tgl_registrasi
                      ? moment(pemilikData.tgl_registrasi).format("DD MMMM YYYY")
                      : "-"}
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Status</span>
                  </label>
                  <div>
                    <span
                      className={`badge badge-lg ${
                        pemilikData.status_aktif ? "badge-success" : "badge-error"
                      }`}
                    >
                      {pemilikData.status_aktif ? "Aktif" : "Non-Aktif"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistik Sapi */}
              {(pemilikData.total_sapi !== undefined || pemilikData.sapi_sehat !== undefined) && (
                <>
                  <div className="divider"></div>
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Statistik Sapi</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {pemilikData.total_sapi !== undefined && (
                        <div className="stat bg-base-200 rounded-lg">
                          <div className="stat-title">Total Sapi</div>
                          <div className="stat-value text-2xl">{pemilikData.total_sapi}</div>
                        </div>
                      )}
                      {pemilikData.sapi_sehat !== undefined && (
                        <div className="stat bg-success/10 rounded-lg">
                          <div className="stat-title">Sapi Sehat</div>
                          <div className="stat-value text-2xl text-success">
                            {pemilikData.sapi_sehat}
                          </div>
                        </div>
                      )}
                      {pemilikData.sapi_sakit !== undefined && (
                        <div className="stat bg-error/10 rounded-lg">
                          <div className="stat-title">Sapi Sakit</div>
                          <div className="stat-value text-2xl text-error">
                            {pemilikData.sapi_sakit}
                          </div>
                        </div>
                      )}
                      {pemilikData.persentase_kapasitas !== undefined && (
                        <div className="stat bg-info/10 rounded-lg">
                          <div className="stat-title">Kapasitas</div>
                          <div className="stat-value text-2xl text-info">
                            {pemilikData.persentase_kapasitas.toFixed(1)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "password" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Ubah Password</h2>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              {/* Password Lama */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Password Lama
                    <span className="text-error ml-1">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full"
                    placeholder="Masukkan password lama"
                    {...registerPassword("old_password", {
                      required: "Password lama harus diisi",
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-base-content/60" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-base-content/60" />
                    )}
                  </button>
                </div>
                {errorsPassword.old_password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errorsPassword.old_password.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Baru */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Password Baru
                    <span className="text-error ml-1">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full"
                    placeholder="Masukkan password baru"
                    {...registerPassword("new_password", {
                      required: "Password baru harus diisi",
                      minLength: {
                        value: 8,
                        message: "Password minimal 8 karakter",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-base-content/60" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-base-content/60" />
                    )}
                  </button>
                </div>
                {errorsPassword.new_password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errorsPassword.new_password.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Konfirmasi Password Baru
                    <span className="text-error ml-1">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full"
                    placeholder="Konfirmasi password baru"
                    {...registerPassword("confirm_password", {
                      required: "Konfirmasi password harus diisi",
                      validate: (value) =>
                        value === newPassword || "Password tidak sama",
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-base-content/60" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-base-content/60" />
                    )}
                  </button>
                </div>
                {errorsPassword.confirm_password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errorsPassword.confirm_password.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="card-actions justify-end mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Mengubah...
                    </>
                  ) : (
                    "Ubah Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

