import React, { useState } from 'react';
import { Card, List, Typography, Button, Input, Empty, Tag, Popconfirm, message, Space, Modal } from 'antd';
import {
    DeleteOutlined,
    SearchOutlined,
    FileTextOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useMeetings } from '../hooks/useMeetings';
import { type Meeting, base64ToBlob } from '../services/meetings';
import { MarkdownViewer } from '../components/MarkdownViewer';

const { Title, Text, Paragraph } = Typography;

interface MeetingHistoryProps {
    onBack: () => void;
    onOpenMeeting?: (meeting: Meeting) => void;
}

export const MeetingHistory: React.FC<MeetingHistoryProps> = ({ onBack, onOpenMeeting: _onOpenMeeting }) => {
    const { meetings, loading, searchQuery, removeMeeting, search } = useMeetings();
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [detailVisible, setDetailVisible] = useState(false);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleDelete = (id: string) => {
        const success = removeMeeting(id);
        if (success) {
            message.success('Meeting dihapus');
        } else {
            message.error('Gagal menghapus meeting');
        }
    };

    const handleViewDetail = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        setDetailVisible(true);
    };

    const getStatusColor = (status: Meeting['status']) => {
        switch (status) {
            case 'completed': return 'green';
            case 'processing': return 'blue';
            case 'recording': return 'orange';
            case 'failed': return 'red';
            default: return 'default';
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginBottom: 24 }}>
                Kembali
            </Button>

            <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={3}>📋 Riwayat Meeting</Title>

                    <Input
                        placeholder="Cari meeting..."
                        prefix={<SearchOutlined />}
                        value={searchQuery}
                        onChange={e => search(e.target.value)}
                        allowClear
                        style={{ marginBottom: 16 }}
                    />

                    {meetings.length === 0 ? (
                        <Empty
                            description={searchQuery ? "Tidak ada hasil pencarian" : "Belum ada meeting tersimpan"}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <List
                            loading={loading}
                            dataSource={meetings}
                            renderItem={(meeting) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            key="view"
                                            type="link"
                                            icon={<FileTextOutlined />}
                                            onClick={() => handleViewDetail(meeting)}
                                        >
                                            Detail
                                        </Button>,
                                        <Popconfirm
                                            key="delete"
                                            title="Hapus meeting ini?"
                                            onConfirm={() => handleDelete(meeting.id)}
                                            okText="Ya"
                                            cancelText="Tidak"
                                        >
                                            <Button danger type="link" icon={<DeleteOutlined />}>
                                                Hapus
                                            </Button>
                                        </Popconfirm>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={
                                            <Space>
                                                <Text strong>{meeting.title}</Text>
                                                <Tag color={getStatusColor(meeting.status)}>
                                                    {meeting.status}
                                                </Tag>
                                            </Space>
                                        }
                                        description={
                                            <Space split="•">
                                                <Text type="secondary">
                                                    <CalendarOutlined /> {formatDate(meeting.createdAt)}
                                                </Text>
                                                <Text type="secondary">
                                                    <ClockCircleOutlined /> {formatDuration(meeting.duration)}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </Space>
            </Card>

            {/* Detail Modal */}
            <Modal
                title={selectedMeeting?.title}
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={700}
            >
                {selectedMeeting && (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Space split="•">
                            <Text type="secondary">
                                <CalendarOutlined /> {formatDate(selectedMeeting.createdAt)}
                            </Text>
                            <Text type="secondary">
                                <ClockCircleOutlined /> {formatDuration(selectedMeeting.duration)}
                            </Text>
                            <Tag color={getStatusColor(selectedMeeting.status)}>
                                {selectedMeeting.status}
                            </Tag>
                        </Space>

                        {selectedMeeting.audioUrl && (
                            <Card size="small" title="Audio">
                                <audio
                                    controls
                                    src={selectedMeeting.audioUrl.startsWith('data:')
                                        ? selectedMeeting.audioUrl
                                        : URL.createObjectURL(base64ToBlob(selectedMeeting.audioUrl))
                                    }
                                    style={{ width: '100%' }}
                                />
                            </Card>
                        )}

                        {selectedMeeting.transcript && (
                            <Card size="small" title="Transcript">
                                <Paragraph
                                    ellipsis={{ rows: 5, expandable: true, symbol: 'Lihat semua' }}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {selectedMeeting.transcript.text}
                                </Paragraph>
                            </Card>
                        )}

                        {selectedMeeting.summary && (
                            <Card size="small" title="AI Summary">
                                <MarkdownViewer content={selectedMeeting.summary} />
                            </Card>
                        )}
                    </Space>
                )}
            </Modal>
        </div>
    );
};
