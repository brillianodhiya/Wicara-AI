// Plugin Registry - All available plugins are registered here
import { PluginManager } from './core/PluginManager';
import { ExportSummaryPlugin } from './export-summary';
import { ElevenLabsVoicePlugin } from './elevenlabs-voice';

// Register all bundled plugins
export function initializePlugins() {
  PluginManager.register(ExportSummaryPlugin);
  PluginManager.register(ElevenLabsVoicePlugin);

  console.log('[PluginRegistry] Plugins initialized:', PluginManager.getAllPlugins().map(p => p.meta.id));
}
