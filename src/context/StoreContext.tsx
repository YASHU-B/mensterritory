'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StoreSettings } from '@/types';
import { INITIAL_STORE_SETTINGS } from '@/lib/supabase/fallback-data';
import { getStoreSettings } from '@/lib/supabase/data-service';

interface StoreContextType {
  settings: StoreSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await getStoreSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load store settings:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <StoreContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
