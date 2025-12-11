/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import {
  AuthState,
  LoginData,
  UpdateProfileData,
  ChangePasswordData,
  RegisterData,
} from "@/types/auth";
import { auth } from "@/services/baseURL";

interface AuthStore extends AuthState {
  // Actions
  login: (data: LoginData) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ loading: true, error: null });
        try {
          const response = await auth.post("/login/", data);

          // Store token in cookies
          Cookies.set("token", response.data.access_token, {
            expires: data.rememberMe ? 30 : 1, // 30 days or 1 day
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          Cookies.set("refresh-token", response.data.refresh_token, {
            expires: 30,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          console.log({ response });

          // Normalize user object - handle jika role adalah string langsung
          const userData = response.data.user;
          let normalizedUser = userData;
          
          // Jika role adalah string, convert ke object format
          if (typeof userData.role === 'string') {
            normalizedUser = {
              ...userData,
              role: {
                id: userData.role,
                name: userData.role,
                permissions: [],
                description: userData.role
              }
            };
          }

          set({
            user: normalizedUser,
            token: response.data.access_token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          toast.success(`Welcome back, ${response.data.user.username}!`);
          return true;
        } catch (error: any) {
          console.log({ error });
          const errorMessage = error.response?.data?.detail || "Login failed";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      register: async (data: RegisterData) => {
        set({ loading: true, error: null });
        try {
          const response = await auth.post("/register/", data);

          set({
            user: response.data.user,
            token: response.data.access_token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          toast.success("Registration successful! Please verify your email.");
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Registration failed";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      logout: () => {
        // Clear cookies
        Cookies.remove("token");
        Cookies.remove("refresh-token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });

        toast.success("Logged out successfully");
      },

      refreshToken: async () => {
        const refreshToken = Cookies.get("refresh-token");
        if (!refreshToken) return false;

        try {
          const response = await auth.post("/refresh-token/", {
            refreshToken,
          });

          Cookies.set("token", response.data.token, {
            expires: 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          set({ token: response.data.token });
          return true;
        } catch (error) {
          console.error("Refresh token failed:", error);
          get().logout();
          return false;
        }
      },

      updateProfile: async (data: UpdateProfileData) => {
        set({ loading: true, error: null });
        try {
          await auth.post("/update-profile/", data);

          // Update user in store (in real app, refetch user data)
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                firstName: data.firstName || currentUser.firstName,
                lastName: data.lastName || currentUser.lastName,
                bio: data.bio || currentUser.bio,
                institution: data.institution || currentUser.institution,
                expertise: data.expertise || currentUser.expertise,
                updatedAt: new Date().toISOString(),
              },
              loading: false,
            });
          }

          toast.success("Profile updated successfully");
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Failed to update profile";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      changePassword: async (data: ChangePasswordData) => {
        set({ loading: true, error: null });
        try {
          await auth.post("/change-password/", data);
          set({ loading: false });
          toast.success("Password changed successfully");
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Failed to change password";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      checkAuth: async () => {
        const token = Cookies.get("token");
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        // In a real app, verify token with backend
        set({ token, isAuthenticated: !!token });

        // Try to refresh token if needed
        if (!get().user) {
          await get().refreshToken();
        }
      },

      clearError: () => {
        set({ error: null });
      },

      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user) return false;

        // Super admin has all permissions
        if (user.role.name === "Super Admin") return true;

        // Check if user has specific permission
        return user.role.permissions.some((p) => p.name === permission);
      },

      hasRole: (role: string) => {
        const user = get().user;
        if (!user || !user.role) return false;
        
        // Handle jika role adalah string langsung (dari backend)
        let userRoleName: string | undefined;
        let userRoleId: string | undefined;
        
        if (typeof user.role === 'string') {
          userRoleName = user.role;
          userRoleId = user.role;
        } else {
          userRoleName = user.role.name;
          userRoleId = user.role.id;
        }
        
        // Check exact match
        if (userRoleName === role || userRoleId === role) return true;
        
        // Check case-insensitive match
        const normalizedUserRole = userRoleName?.toLowerCase().trim();
        const targetRole = role?.toLowerCase().trim();
        if (normalizedUserRole === targetRole) return true;
        
        // Check if role name contains target role (for variations like "super_admin" vs "super admin")
        if (normalizedUserRole && targetRole && normalizedUserRole.includes(targetRole)) return true;
        
        return false;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
