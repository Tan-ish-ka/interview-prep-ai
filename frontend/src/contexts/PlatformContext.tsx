import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlatformStorage, ConnectedPlatform } from '../lib/PlatformStorage';

interface PlatformContextType {
  connections: Record<string, ConnectedPlatform>;
  addConnection: (platform: ConnectedPlatform) => void;
  removeConnection: (platformId: string) => void;
  updateConnection: (platformId: string, updates: Partial<ConnectedPlatform>) => void;
  isAnyConnected: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [connections, setConnections] = useState<Record<string, ConnectedPlatform>>({});

  useEffect(() => {
    setConnections(PlatformStorage.getConnections());
  }, []);

  const addConnection = (platform: ConnectedPlatform) => {
    PlatformStorage.saveConnection(platform);
    setConnections(PlatformStorage.getConnections());
  };

  const removeConnection = (platformId: string) => {
    PlatformStorage.removeConnection(platformId);
    setConnections(PlatformStorage.getConnections());
  };

  const updateConnection = (platformId: string, updates: Partial<ConnectedPlatform>) => {
    PlatformStorage.updateSyncData(platformId, updates);
    setConnections(PlatformStorage.getConnections());
  };

  const isAnyConnected = Object.keys(connections).length > 0;

  return (
    <PlatformContext.Provider value={{ connections, addConnection, removeConnection, updateConnection, isAnyConnected }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatforms() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatforms must be used within a PlatformProvider');
  }
  return context;
}
