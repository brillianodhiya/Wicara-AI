import React, { useState } from 'react';
import { Button, Card, Typography, Space, Input } from 'antd';
import { AudioOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTranscriber } from '../hooks/useTranscriber';
import { AudioVisualizer } from './AudioVisualizer';
import { TranscriptViewer } from './TranscriptViewer';

const { Title, Text } = Typography;

export const RecordingInterface: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording,
        audioBlob,
        clearAudio,
        visualizerData
    } = useAudioRecorder();

    const { isTranscribing, transcript, error, startTranscription } = useTranscriber();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <Card style={{ maxWidth: 800, margin: '20px auto', textAlign: 'center' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={2}>🎙️ Wicara AI Recorder</Title>

                <div style={{ minHeight: '100px', background: '#f0f2f5', borderRadius: '8px', padding: '10px' }}>
                    {isRecording ? (
                        <AudioVisualizer data={visualizerData} />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#999' }}>
                            {audioBlob ? 'Recording Saved (Ready to Transcribe)' : 'Ready to Record'}
                        </div>
                    )}
                </div>

                <Text strong style={{ fontSize: '24px' }}>
                    {formatTime(recordingTime)}
                </Text>

                <Space>
                    {!isRecording ? (
                        <Button
                            type="primary"
                            icon={<AudioOutlined />}
                            size="large"
                            onClick={startRecording}
                            shape="round"
                        >
                            Start Recording
                        </Button>
                    ) : (
                        <Button
                            danger
                            icon={<StopOutlined />}
                            size="large"
                            onClick={stopRecording}
                            shape="round"
                        >
                            Stop Recording
                        </Button>
                    )}

                    {audioBlob && !isRecording && (
                        <Button
                            icon={<DeleteOutlined />}
                            size="large"
                            onClick={clearAudio}
                        >
                            Clear
                        </Button>
                    )}
                </Space>

                {audioBlob && (
                    <div style={{ marginTop: 20 }}>
                        <audio controls src={URL.createObjectURL(audioBlob)} style={{ marginBottom: 20 }} />

                        <Card type="inner" title="Transcription Setup (BYOK)" size="small" style={{ maxWidth: 500, margin: '0 auto' }}>
                            <Input.Password
                                placeholder="Enter AssemblyAI API Key"
                                value={apiKey}
                                onChange={e => setApiKey(e.target.value)}
                                style={{ marginBottom: 10 }}
                            />
                            <Button
                                type="primary"
                                onClick={() => audioBlob && startTranscription(apiKey, audioBlob)}
                                loading={isTranscribing}
                                disabled={!apiKey}
                                block
                            >
                                Transcribe Now
                            </Button>
                        </Card>
                    </div>
                )}

                <TranscriptViewer transcript={transcript} isLoading={isTranscribing} error={error} />

            </Space>
        </Card>
    );
};
