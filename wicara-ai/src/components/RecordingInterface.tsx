import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Input, message, Modal } from 'antd';
import { AudioOutlined, StopOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTranscriber } from '../hooks/useTranscriber';
import { useApiKeys } from '../hooks/useApiKeys';
import { useMeetings } from '../hooks/useMeetings';
import { blobToBase64 } from '../services/meetings';
import { AudioVisualizer } from './AudioVisualizer';
import { TranscriptViewer } from './TranscriptViewer';

const { Title, Text } = Typography;

interface RecordingInterfaceProps {
    onSaved?: () => void;
}

export const RecordingInterface: React.FC<RecordingInterfaceProps> = ({ onSaved }) => {
    const { keys, loaded } = useApiKeys();
    const [apiKey, setApiKey] = useState('');
    const [meetingTitle, setMeetingTitle] = useState('');
    const [saveModalVisible, setSaveModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentSummary, setCurrentSummary] = useState<string | null>(null);

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
    const { addMeeting } = useMeetings();

    // Load saved AssemblyAI key from Settings
    useEffect(() => {
        if (loaded) {
            setApiKey(keys.assemblyai || import.meta.env.VITE_ASSEMBLYAI_API_KEY || '');
        }
    }, [loaded, keys]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSaveMeeting = async () => {
        if (!transcript) {
            message.warning('Lakukan transcribe dulu sebelum menyimpan');
            return;
        }

        setSaving(true);
        try {
            let audioUrl: string | undefined;
            if (audioBlob) {
                audioUrl = await blobToBase64(audioBlob);
            }

            const title = meetingTitle.trim() || `Meeting ${new Date().toLocaleDateString('id-ID')}`;

            addMeeting({
                title,
                duration: recordingTime,
                status: 'completed',
                audioUrl,
                transcript: {
                    text: transcript.text || '',
                    utterances: transcript.utterances
                },
                summary: currentSummary || undefined
            });

            message.success('Meeting berhasil disimpan!');
            setSaveModalVisible(false);
            setMeetingTitle('');
            clearAudio();
            onSaved?.();
        } catch (err) {
            message.error('Gagal menyimpan meeting');
        } finally {
            setSaving(false);
        }
    };

    const canSave = transcript && !isTranscribing && !isRecording;

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

                <Space wrap style={{ justifyContent: 'center', width: '100%' }}>
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
                        <>
                            <Button
                                icon={<DeleteOutlined />}
                                size="large"
                                onClick={clearAudio}
                            >
                                Clear
                            </Button>
                            {canSave && (
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    size="large"
                                    onClick={() => setSaveModalVisible(true)}
                                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                >
                                    Simpan
                                </Button>
                            )}
                        </>
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

                <TranscriptViewer
                    transcript={transcript}
                    isLoading={isTranscribing}
                    error={error}
                    onSummaryGenerated={setCurrentSummary}
                />

            </Space>

            {/* Save Modal */}
            <Modal
                title="💾 Simpan Meeting"
                open={saveModalVisible}
                onOk={handleSaveMeeting}
                onCancel={() => setSaveModalVisible(false)}
                confirmLoading={saving}
                okText="Simpan"
                cancelText="Batal"
            >
                <Input
                    placeholder="Judul Meeting (opsional)"
                    value={meetingTitle}
                    onChange={e => setMeetingTitle(e.target.value)}
                    style={{ marginTop: 16 }}
                />
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                    Durasi: {formatTime(recordingTime)} | Transcript: {transcript?.text?.length || 0} karakter
                </Text>
            </Modal>
        </Card>
    );
};
