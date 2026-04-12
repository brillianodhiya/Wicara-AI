import { useSyncExternalStore, useCallback, useState, useEffect } from 'react';
import { PluginManager } from './PluginManager';
import { useAuth } from '../../contexts/AuthContextCore';
import { supabase } from '../../lib/supabase';

// Hook to get all plugins with reactivity
export function usePlugins() {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const subscribe = useCallback((callback: () => void) => {
    // For MVP, we don't have real-time updates
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

  useEffect(() => {
    if (user) {
      syncWithDatabase();
    }
  }, [user]);

  const syncWithDatabase = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const { data, error } = await supabase
        .from('user_plugins')
        .select('plugin_id')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        const remoteIds = new Set(data.map(d => d.plugin_id));
        const localIds = PluginManager.getInstalledIds();
        let changed = false;

        for (const id of remoteIds) {
          if (!localIds.has(id)) {
            PluginManager.install(id);
            changed = true;
          }
        }

        for (const id of localIds) {
          if (!remoteIds.has(id)) {
            PluginManager.uninstall(id);
            changed = true;
          }
        }

        if (changed) {
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch (err) {
      console.error('Failed to sync plugins with DB:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    plugins: PluginManager.getAllPlugins(),
    isInstalled: (id: string) => PluginManager.isInstalled(id),
    isSyncing,
    install: async (id: string) => {
      PluginManager.install(id);
      window.dispatchEvent(new Event('storage'));

      if (user) {
        try {
          await supabase.from('user_plugins').upsert(
            { user_id: user.id, plugin_id: id },
            { onConflict: 'user_id, plugin_id', ignoreDuplicates: true }
          );
        } catch (e) {
          console.error("DB Sync error on install", e);
        }
      }
    },
    uninstall: async (id: string) => {
      PluginManager.uninstall(id);
      window.dispatchEvent(new Event('storage'));

      if (user) {
        try {
          await supabase.from('user_plugins')
            .delete()
            .eq('user_id', user.id)
            .eq('plugin_id', id);
        } catch (e) {
          console.error("DB Sync error on uninstall", e);
        }
      }
    },
  };
}

// Hook to trigger hooks
export function usePluginHook() {
  return {
    trigger: PluginManager.trigger.bind(PluginManager),
  };
}
