'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminUser: AdminUser | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAdminUser({
            id: 'admin_session',
            user_id: 'admin_session',
            email: data.user.email,
            role: data.user.role || 'super_admin',
            full_name: data.user.full_name || 'Store Administrator',
          });
          return;
        }
      }
      setAdminUser(null);
    } catch (e) {
      console.error('Session check failed:', e);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pass }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();

      if (res.ok && data.success) {
        setAdminUser({
          id: 'admin_session',
          user_id: 'admin_session',
          email: data.user.email,
          role: data.user.role || 'super_admin',
          full_name: data.user.full_name || 'Store Administrator',
        });
        showToast('Welcome back, Administrator!', 'success');
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: data.error || 'Authentication failed. Please verify credentials.',
      };
    } catch (err: any) {
      console.error('Login request error:', err);
      setIsLoading(false);
      if (err.name === 'AbortError') {
        return {
          success: false,
          error: 'Authentication request timed out. Please try again.',
        };
      }
      return {
        success: false,
        error: 'Network or server error while connecting to authentication service.',
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    setAdminUser(null);
    showToast('Signed out of admin portal', 'info');
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: Boolean(adminUser),
        isLoading,
        adminUser,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
