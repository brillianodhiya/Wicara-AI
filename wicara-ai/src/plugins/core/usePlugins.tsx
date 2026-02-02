import React, { useSyncExternalStore, useCallback } from 'react';
import { PluginManager } from './PluginManager';
import type { AvailableSlot } from './types';

// Hook to get all plugins with reactivity
export function usePlugins() {
  const subscribe = useCallback((callback: () => void) => {
    // For MVP, we don't have real-time updates
    // This is a placeholder for future reactivity
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return JSON.stringify(PluginManager.getAllPlugins().map(p => ({
      id: p.meta.id,
      installed: PluginManager.isInstalled(p.meta.id),
    })));
  }, []);

  useSyncExternalStore(subscribe, getSnapshot);

  return {
    plugins: PluginManager.getAllPlugins(),
    isInstalled: (id: string) => PluginManager.isInstalled(id),
    install: (id: string) => {
      PluginManager.install(id);
      window.dispatchEvent(new Event('storage'));
    },
    uninstall: (id: string) => {
      PluginManager.uninstall(id);
      window.dispatchEvent(new Event('storage'));
    },
  };
}

// Component to render slot content
interface PluginSlotComponentProps {
  name: AvailableSlot;
  context: Record<string, unknown>;
}

export const PluginSlot: React.FC<PluginSlotComponentProps> = ({ name, context }) => {
  const components = PluginManager.getSlotComponents(name);

  return (
    <>
      {components.map((Component, index) => (
        <Component key={`${name}-${index}`} context={context} />
      ))}
    </>
  );
};

// Hook to trigger hooks
export function usePluginHook() {
  return {
    trigger: PluginManager.trigger.bind(PluginManager),
  };
}
