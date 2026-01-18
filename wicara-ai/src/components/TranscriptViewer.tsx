import React from 'react';
import { Card, List, Tag, Typography, Spin, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface TranscriptViewerProps {
    transcript: any;
    isLoading: boolean;
    error: string | null;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ transcript, isLoading, error }) => {
    if (isLoading) {
        return (
            <Card style={{ margin: '20px 0', textAlign: 'center' }}>
                <Spin size="large" tip="Transcribing audio..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Alert
                message="Transcription Error"
                description={error}
                type="error"
                showIcon
                style={{ margin: '20px 0' }}
            />
        );
    }

    if (!transcript) return null;

    return (
        <Card title="📄 Transcript" style={{ margin: '20px 0', textAlign: 'left' }}>
            <List
                itemLayout="horizontal"
                dataSource={transcript.utterances || []} // Handling utterances with speaker labels
                renderItem={(item: any) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Tag icon={<UserOutlined />} color="blue">Speaker {item.speaker}</Tag>}
                            title={<Text type="secondary">{new Date(item.start).toISOString().substr(14, 5)}</Text>}
                            description={<Text style={{ fontSize: '16px', color: '#333' }}>{item.text}</Text>}
                        />
                    </List.Item>
                )}
            />
            {!transcript.utterances && (
                <div style={{ padding: 20 }}>
                    <Text>{transcript.text}</Text>
                </div>
            )}
        </Card>
    );
};
