import type { PluginDefinition } from '../core/types';
import { RecorderOptions } from './RecorderOptions';
import { getMixedStream } from './service';

export const UniversalRecorderPlugin: PluginDefinition = {
  meta: {
    id: 'universal-recorder',
    name: 'Universal Meeting Recorder',
    description: 'Record system audio (Google Meet, Zoom) along with microphone input.',
    version: '1.0.0',
    author: 'Wicara AI',
    icon: '⏺️',
    category: 'productivity',
    price: 'free',
  },
  hooks: {
    'audio:get-stream': async (data: unknown) => {
      const currentStream = data as MediaStream | null;
      
      // If we already have a stream, maybe we shouldn't override it?
      // Or maybe we treat this as a chain?
      // For now, if currentStream is null (default fallback), try to get mixed stream.
      if (currentStream) return currentStream;

      try {
        const stream = await getMixedStream();
        return stream;
      } catch (error) {
        console.error('Universal Recorder failed to get stream:', error);
        return null; // Fallback to default mic
      }
    }
  },
  slots: {
    'recording-options': RecorderOptions,
  },
  onInstall: () => {
    console.log('[UniversalRecorderPlugin] Installed');
  },
  onUninstall: () => {
    console.log('[UniversalRecorderPlugin] Uninstalled');
  },
};
