import React, { useState } from 'react';
import { Modal, Button, Space, message, Typography, Divider } from 'antd';
import { FileTextOutlined, FileMarkdownOutlined, CopyOutlined, FileOutlined } from '@ant-design/icons';
import type { ExportData } from '../core/types';
import { exportToTxt, exportToMarkdown, exportToJson, copyToClipboard } from './handlers';

const { Text } = Typography;

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  data: ExportData | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, data }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (format: string, handler: (data: ExportData) => Promise<void>) => {
    if (!data) return;

    setLoading(format);
    try {
      await handler(data);
      if (format === 'clipboard') {
        message.success('Copied to clipboard!');
      } else {
        message.success(`Exported to ${format.toUpperCase()}`);
      }
      onClose();
    } catch (err) {
      message.error('Export failed');
    } finally {
      setLoading(null);
    }
  };

  const exportOptions = [
    { id: 'txt', label: 'Plain Text (.txt)', icon: <FileTextOutlined />, handler: exportToTxt },
    { id: 'md', label: 'Markdown (.md)', icon: <FileMarkdownOutlined />, handler: exportToMarkdown },
    { id: 'json', label: 'JSON (.json)', icon: <FileOutlined />, handler: exportToJson },
    { id: 'clipboard', label: 'Copy to Clipboard', icon: <CopyOutlined />, handler: copyToClipboard },
  ];

  return (
    <Modal
      title="📤 Export Meeting"
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      {data && (
        <>
          <Text type="secondary">
            Exporting: <strong>{data.meeting.title}</strong>
          </Text>
          <Divider />
          <Space direction="vertical" style={{ width: '100%' }}>
            {exportOptions.map(opt => (
              <Button
                key={opt.id}
                icon={opt.icon}
                block
                size="large"
                loading={loading === opt.id}
                onClick={() => handleExport(opt.id, opt.handler)}
              >
                {opt.label}
              </Button>
            ))}
          </Space>
        </>
      )}
    </Modal>
  );
};
