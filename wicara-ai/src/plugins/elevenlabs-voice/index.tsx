import React, { useState } from 'react';
import { Button } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import type { PluginDefinition, PluginSlotProps } from '../core/types';
import { VoiceModal } from './VoiceModal';

// Voice provider definition for Settings integration
export interface VoiceProvider {
  value: string;
  label: string;
  description: string;
}

// Slot component for meeting actions
const MeetingActionsSlot: React.FC<PluginSlotProps> = ({ context }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const meeting = context.meeting as {
    transcript?: { text: string };
    summary?: string;
  };

  // Prefer summary, fallback to transcript text
  const textToConvert = meeting.summary || meeting.transcript?.text || '';

  return (
    <>
      <Button
        type="default"
        icon={<AudioOutlined />}
        onClick={() => setModalOpen(true)}
        size="small"
      >
        Voice
      </Button>
      <VoiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialText={textToConvert}
      />
    </>
  );
};

// Plugin definition
export const ElevenLabsVoicePlugin: PluginDefinition = {
  meta: {
    id: 'elevenlabs-voice',
    name: 'ElevenLabs Voice',
    description: 'Convert meeting transcripts and summaries to natural voice audio using ElevenLabs AI.',
    version: '1.0.0',
    author: 'Wicara AI',
    icon: '/elevenlabs58.webp',
    category: 'ai',
    price: 'free', // Free plugin, user brings their own ElevenLabs API key
  },
  hooks: {
    'settings:voice-providers': (data: unknown) => {
      const providers = data as VoiceProvider[];
      providers.push({
        value: 'elevenlabs',
        label: 'ElevenLabs',
        description: 'Text-to-speech AI (requires API key)'
      });
      return providers;
    }
  },
  slots: {
    'meeting-actions': MeetingActionsSlot,
  },
  onInstall: () => {
    console.log('[ElevenLabsVoicePlugin] Installed');
  },
  onUninstall: () => {
    console.log('[ElevenLabsVoicePlugin] Uninstalled');
    // Optionally clear saved API key
    // localStorage.removeItem('wicara:elevenlabs-key');
  },
};

