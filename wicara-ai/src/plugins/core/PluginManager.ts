import type { PluginDefinition, HookHandler, AvailableHook, AvailableSlot, PluginSlotProps } from './types';

const STORAGE_KEY = 'wicara:installed-plugins';

class PluginManagerClass {
  private plugins: Map<string, PluginDefinition> = new Map();
  private installedIds: Set<string> = new Set();
  private hooks: Map<string, HookHandler[]> = new Map();
  private slots: Map<string, React.ComponentType<PluginSlotProps>[]> = new Map();

  constructor() {
    this.loadInstalledFromStorage();
  }

  private loadInstalledFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        this.installedIds = new Set(ids);
      }
    } catch {
      this.installedIds = new Set();
    }
  }

  private saveInstalledToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.installedIds]));
  }

  // Register a plugin definition (called at app init)
  register(plugin: PluginDefinition) {
    this.plugins.set(plugin.meta.id, plugin);

    // If already installed, activate it
    if (this.installedIds.has(plugin.meta.id)) {
      this.activatePlugin(plugin);
    }
  }

  private activatePlugin(plugin: PluginDefinition) {
    // Register hooks
    if (plugin.hooks) {
      for (const [hookName, handler] of Object.entries(plugin.hooks)) {
        const existing = this.hooks.get(hookName) || [];
        existing.push(handler as HookHandler);
        this.hooks.set(hookName, existing);
      }
    }

    // Register slots
    if (plugin.slots) {
      for (const [slotName, component] of Object.entries(plugin.slots)) {
        const existing = this.slots.get(slotName) || [];
        existing.push(component);
        this.slots.set(slotName, existing);
      }
    }
  }

  private deactivatePlugin(plugin: PluginDefinition) {
    // Remove hooks
    if (plugin.hooks) {
      for (const [hookName, handler] of Object.entries(plugin.hooks)) {
        const existing = this.hooks.get(hookName) || [];
        const filtered = existing.filter(h => h !== handler);
        this.hooks.set(hookName, filtered);
      }
    }

    // Remove slots
    if (plugin.slots) {
      for (const [slotName, component] of Object.entries(plugin.slots)) {
        const existing = this.slots.get(slotName) || [];
        const filtered = existing.filter(c => c !== component);
        this.slots.set(slotName, filtered);
      }
    }
  }

  // Install a plugin
  install(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    if (!this.installedIds.has(pluginId)) {
      this.installedIds.add(pluginId);
      this.saveInstalledToStorage();
      this.activatePlugin(plugin);
      plugin.onInstall?.();
    }
    return true;
  }

  // Uninstall a plugin
  uninstall(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    if (this.installedIds.has(pluginId)) {
      this.installedIds.delete(pluginId);
      this.saveInstalledToStorage();
      this.deactivatePlugin(plugin);
      plugin.onUninstall?.();
    }
    return true;
  }

  // Check if installed
  isInstalled(pluginId: string): boolean {
    return this.installedIds.has(pluginId);
  }

  // Get all registered plugins
  getAllPlugins(): PluginDefinition[] {
    return [...this.plugins.values()];
  }

  // Trigger a hook (async)
  async trigger<T>(hookName: AvailableHook, initialData: T): Promise<T> {
    const handlers = this.hooks.get(hookName) || [];
    let data = initialData;

    for (const handler of handlers) {
      data = await handler(data) as T;
    }

    return data;
  }

  // Trigger a hook (sync - for settings/UI where we know handlers are sync)
  triggerSync<T>(hookName: AvailableHook, initialData: T): T {
    const handlers = this.hooks.get(hookName) || [];
    let data = initialData;

    for (const handler of handlers) {
      data = handler(data) as T;
    }

    return data;
  }

  // Get slot components
  getSlotComponents(slotName: AvailableSlot): React.ComponentType<PluginSlotProps>[] {
    return this.slots.get(slotName) || [];
  }
}

export const PluginManager = new PluginManagerClass();
