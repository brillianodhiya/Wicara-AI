import React, { useState } from 'react';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import type { PluginDefinition, PluginSlotProps, ExportData } from '../core/types';
import { ExportModal } from './ExportModal';

// Slot component for meeting actions
const MeetingActionsSlot: React.FC<PluginSlotProps> = ({ context }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const meeting = context.meeting as {
    id: string;
    title: string;
    duration: number;
    createdAt: string;
    transcript?: { text: string; utterances?: Array<{ speaker: string; text: string; start: number; end: number }> };
    summary?: string;
  };

  const exportData: ExportData = {
    meeting: {
      id: meeting.id,
      title: meeting.title,
      duration: meeting.duration,
      createdAt: meeting.createdAt,
    },
    transcript: meeting.transcript,
    summary: meeting.summary,
  };

  return (
    <>
      <Button
        type="default"
        icon={<ExportOutlined />}
        onClick={() => setModalOpen(true)}
        size="small"
      >
        Export
      </Button>
      <ExportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={exportData}
      />
    </>
  );
};

// Plugin definition
export const ExportSummaryPlugin: PluginDefinition = {
  meta: {
    id: 'export-summary',
    name: 'Export Summary',
    description: 'Export meeting transcripts and summaries to TXT, Markdown, JSON, or clipboard.',
    version: '1.0.0',
    author: 'Wicara AI',
    icon: '📤',
    category: 'export',
    price: 'free',
  },
  slots: {
    'meeting-actions': MeetingActionsSlot,
  },
  onInstall: () => {
    console.log('[ExportSummaryPlugin] Installed');
  },
  onUninstall: () => {
    console.log('[ExportSummaryPlugin] Uninstalled');
  },
};
