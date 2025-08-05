
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserProfile } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

const USER_AUTH_COOKIE = 'user-auth';

// Helper to get cookie
const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

// Helper to set cookie
const setCookie = (name: string, value: string, days: number) => {
    if (typeof document === 'undefined') return;
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

// Helper to remove cookie
const removeCookie = (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const userCookie = getCookie(USER_AUTH_COOKIE);
      if (userCookie) {
        const userData: User = JSON.parse(userCookie);
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to parse user auth cookie", error);
      removeCookie(USER_AUTH_COOKIE);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      setCookie(USER_AUTH_COOKIE, JSON.stringify(foundUser), 1);
      router.push('/dashboard');
      return true;
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    removeCookie(USER_AUTH_COOKIE);
    router.push('/login');
  }, [router]);
  
  const hasRole = (roles: UserProfile | UserProfile[]) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.perfil);
    }
    return user.perfil === roles;
  };

  return { user, login, logout, loading, hasRole };
}
