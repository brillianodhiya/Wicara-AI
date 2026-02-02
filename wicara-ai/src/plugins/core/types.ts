// Plugin System Types

export type PluginCategory = 'export' | 'integration' | 'ai' | 'utility';

export interface PluginMeta {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon: string;
  category: PluginCategory;
  price: number | 'free';
}

export type HookHandler<T = unknown> = (data: T) => T | Promise<T>;

export interface PluginSlotProps {
  context: Record<string, unknown>;
}

export interface PluginDefinition {
  meta: PluginMeta;
  hooks?: Record<string, HookHandler>;
  slots?: Record<string, React.ComponentType<PluginSlotProps>>;
  onInstall?: () => void;
  onUninstall?: () => void;
}

// Available hooks in the app
export const AVAILABLE_HOOKS = [
  'meeting:after-save',
  'transcript:before-display',
  'export:formats',
  'summary:generate',
  'audio:process',
  'settings:voice-providers',  // Plugins can add voice providers to Settings
] as const;

export type AvailableHook = typeof AVAILABLE_HOOKS[number];

// Available slots in the app
export const AVAILABLE_SLOTS = [
  'meeting-actions',
  'transcript-toolbar',
  'settings-panel',
] as const;

export type AvailableSlot = typeof AVAILABLE_SLOTS[number];

// Export format type (used by export plugins)
export interface ExportFormat {
  id: string;
  label: string;
  icon: string;
  handler: (data: ExportData) => Promise<void>;
}

export interface ExportData {
  meeting: {
    id: string;
    title: string;
    duration: number;
    createdAt: string;
  };
  transcript?: {
    text: string;
    utterances?: Array<{
      speaker: string;
      text: string;
      start: number;
      end: number;
    }>;
  };
  summary?: string;
}
