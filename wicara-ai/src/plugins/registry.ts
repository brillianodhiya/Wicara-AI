// Plugin Registry - All available plugins are registered here
import { PluginManager } from './core/PluginManager';
import { ExportSummaryPlugin } from './export-summary';
import { ElevenLabsVoicePlugin } from './elevenlabs-voice';
import { UniversalRecorderPlugin } from './universal-recorder';
import type { PluginDefinition } from './core/types';

export const RealtimeAIPlugin: PluginDefinition = {
    meta: {
        id: 'realtime-ai',
        name: 'Realtime AI Dictation',
        description: 'Transcribe your voice in real-time using Cloudflare Workers AI Whisper model. Requires a Cloudflare account.',
        version: '1.0.0',
        author: 'Wicara AI',
        icon: '⚡',
        category: 'ai',
        price: 'free'
    }
};

// Register all bundled plugins
export function initializePlugins() {
  PluginManager.register(ExportSummaryPlugin);
  PluginManager.register(ElevenLabsVoicePlugin);
  PluginManager.register(UniversalRecorderPlugin);
  PluginManager.register(RealtimeAIPlugin);

  console.log('[PluginRegistry] Plugins initialized:', PluginManager.getAllPlugins().map(p => p.meta.id));
}
