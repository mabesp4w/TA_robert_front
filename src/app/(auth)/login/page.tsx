/** @format */

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth/authStore";
import { LoginData } from "@/types/auth";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // store
  const { login, isAuthenticated, user } = useAuthStore();
  // router
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      await login(data);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      // Helper untuk get role name (handle string atau object)
      const getUserRoleName = (): string | undefined => {
        if (!user.role) return undefined;
        if (typeof user.role === 'string') return user.role;
        return user.role.name;
      };

      const roleName = getUserRoleName();
      
      // Redirect berdasarkan role
      if (roleName?.toLowerCase() === "pemilik") {
        router.push("/pemilik/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-pink-500 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-400 rounded-full opacity-30"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Side - Sign In Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    Sign In
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email address"
                      className={`w-full pl-10 pr-4 py-3 border-b-2 bg-transparent focus:outline-none focus:border-blue-500 transition-colors ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("username", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`w-full pl-10 pr-12 py-3 border-b-2 bg-transparent focus:outline-none focus:border-blue-500 transition-colors ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Masuk...
                      </div>
                    ) : (
                      "Masuk"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side - Welcome Section */}
            <div className="lg:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
              {/* Background decorations */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-pink-500 rounded-full opacity-30"></div>
              <div className="absolute bottom-20 left-10 w-4 h-4 bg-cyan-400 rounded-full opacity-60"></div>

              <div className="relative z-10 max-w-md mx-auto lg:mx-0">
                {/* Logo Area */}
                {/* <div className="mb-12">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-cyan-400 rounded-full mr-3"></div>
                    <span className="text-xl font-semibold">Logo Here</span>
                  </div>
                </div> */}

                {/* Welcome Message */}
                <div className="mb-8">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-6">
                    Selamat datang di Sistem Diagnosis Penyakit Sapi
                  </h1>
                  <p className="text-purple-200 leading-relaxed">
                    Sistem ini dirancang untuk membantu peternak dalam
                    mendiagnosis penyakit sapi dengan menggunakan metode fuzzy
                    logic Mamdani.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
