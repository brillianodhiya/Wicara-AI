// Plugin System Types

export type PluginCategory = 'export' | 'integration' | 'ai' | 'utility' | 'productivity';

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
  'settings:voice-providers',
  'audio:get-stream', // Plugins can provide audio stream (e.g. system audio)
] as const;

export type AvailableHook = typeof AVAILABLE_HOOKS[number];

// Available slots in the app
export const AVAILABLE_SLOTS = [
  'meeting-actions', // Actions in meeting details (e.g. Export, Voice)
  'sidebar-menu',    // Custom sidebar items
  'recording-options', // Options in recording interface (e.g. System Audio toggle)
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
