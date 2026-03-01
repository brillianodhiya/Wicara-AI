import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Input, message, Modal, Select, Row, Col, Tag, Flex } from 'antd';
import { AudioOutlined, StopOutlined, DeleteOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTranscriber } from '../hooks/useTranscriber';
import { useApiKeys } from '../hooks/useApiKeys';
import { useMeetings } from '../hooks/useMeetings';
import { blobToBase64 } from '../services/meetings';
import { AudioVisualizer } from './AudioVisualizer';
import { TranscriptViewer, type TranscriptSession } from './TranscriptViewer';
import { PluginSlot } from '../plugins/core/usePlugins';

const { Text } = Typography;

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
    const [sessions, setSessions] = useState<TranscriptSession[]>([]);
    const [lastTranscriptId, setLastTranscriptId] = useState(0);

    const {
        isRecording,
        recordingTime,
        totalRecordingTime,
        sessionCount,
        startRecording,
        stopRecording,
        audioBlob,
        clearAudio,
        visualizerData,
        devices,
        selectedDeviceId,
        setSelectedDeviceId,
        getAudioDevices
    } = useAudioRecorder();

    const { isTranscribing, transcript, error, startTranscription } = useTranscriber();
    const { addMeeting } = useMeetings();

    // Fetch audio devices on mount
    useEffect(() => {
        getAudioDevices();
    }, [getAudioDevices]);

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

    // Accumulate transcript into sessions when a new one arrives
    useEffect(() => {
        if (transcript && sessionCount > 0) {
            const currentId = sessionCount;
            if (currentId !== lastTranscriptId) {
                setSessions(prev => [...prev, {
                    sessionIndex: currentId,
                    transcript: transcript
                }]);
                setLastTranscriptId(currentId);
            }
        }
    }, [transcript, sessionCount, lastTranscriptId]);

    // Build merged transcript text from all sessions
    const getMergedTranscriptText = () => {
        if (sessions.length === 0 && transcript) return transcript.text || '';
        return sessions.map(s => s.transcript?.text || '').join('\n\n');
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
                duration: totalRecordingTime,
                status: 'completed',
                audioUrl,
                transcript: {
                    text: getMergedTranscriptText(),
                    utterances: transcript.utterances
                },
                summary: currentSummary || undefined
            });

            message.success('Meeting berhasil disimpan!');
            setSaveModalVisible(false);
            setMeetingTitle('');
            clearAudio();
            setSessions([]);
            setLastTranscriptId(0);
            onSaved?.();
        } catch (err) {
            message.error('Gagal menyimpan meeting');
        } finally {
            setSaving(false);
        }
    };

    const canSave = transcript && !isTranscribing && !isRecording;
    const hasContent = audioBlob || transcript;

    return (
        <div style={{ padding: '0 4px' }}>
            <Row gutter={[16, 16]} align="stretch">
                {/* ======= LEFT COLUMN: Recorder Panel ======= */}
                <Col xs={24} lg={12}>
                    <Card 
                        style={{ height: '100%' }}
                        title={
                            <Flex justify="space-between" align="center">
                                <span>🎙️ Recorder</span>
                                {sessionCount > 0 && (
                                    <Tag color="blue">Sesi: {sessionCount}</Tag>
                                )}
                            </Flex>
                        }
                    >
                        <Flex vertical gap="middle" style={{ width: '100%' }}>
                            {/* Plugin recording options */}
                            <PluginSlot name="recording-options" context={{}} />

                            {/* Microphone Selection - always visible */}
                            <div>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Input Device:</Text>
                                <Select
                                    value={selectedDeviceId}
                                    onChange={setSelectedDeviceId}
                                    options={devices.map(d => ({ label: d.label, value: d.deviceId }))}
                                    style={{ width: '100%' }}
                                    placeholder="Select Microphone"
                                    disabled={isRecording}
                                />
                            </div>

                            {/* Audio Visualizer */}
                            <div style={{ minHeight: '100px', background: '#f0f2f5', borderRadius: '8px', padding: '10px' }}>
                                {isRecording ? (
                                    <AudioVisualizer data={visualizerData} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#999' }}>
                                        {audioBlob 
                                            ? `✅ ${sessionCount} sesi terekam (${formatTime(totalRecordingTime)})` 
                                            : 'Ready to Record'}
                                    </div>
                                )}
                            </div>

                            {/* Timer */}
                            <div style={{ textAlign: 'center' }}>
                                <Text strong style={{ fontSize: '28px', fontFamily: 'monospace' }}>
                                    {isRecording ? formatTime(recordingTime) : formatTime(totalRecordingTime)}
                                </Text>
                                {isRecording && (
                                    <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                        Total: {formatTime(totalRecordingTime)}
                                    </Text>
                                )}
                            </div>

                            {/* Controls */}
                            <Flex wrap gap="small" justify="center">
                                {!isRecording ? (
                                    <Button
                                        type="primary"
                                        icon={audioBlob ? <PlusOutlined /> : <AudioOutlined />}
                                        size="large"
                                        onClick={startRecording}
                                        shape="round"
                                    >
                                        {audioBlob ? 'Rekam Lagi' : 'Start Recording'}
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

                                {hasContent && !isRecording && (
                                    <>
                                        <Button
                                            icon={<DeleteOutlined />}
                                            size="large"
                                            onClick={() => {
                                                clearAudio();
                                                setCurrentSummary(null);
                                                setSessions([]);
                                                setLastTranscriptId(0);
                                            }}
                                        >
                                            Reset
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
                            </Flex>

                            {/* Audio Playback & Transcribe - always visible */}
                            <Flex vertical gap="small">
                                {audioBlob ? (
                                    <audio controls src={URL.createObjectURL(audioBlob)} style={{ width: '100%' }} />
                                ) : (
                                    <div style={{ padding: '12px', background: '#fafafa', borderRadius: 8, textAlign: 'center' }}>
                                        <Text type="secondary">Audio playback akan muncul setelah merekam</Text>
                                    </div>
                                )}

                                {apiKey ? (
                                    <Button
                                        type="primary"
                                        onClick={() => audioBlob && startTranscription(apiKey, audioBlob)}
                                        loading={isTranscribing}
                                        disabled={!audioBlob || isRecording}
                                        block
                                        size="large"
                                    >
                                        {transcript ? 'Re-Transcribe' : 'Transcribe Now'}
                                    </Button>
                                ) : (
                                    <Card type="inner" title="Transcription Setup (BYOK)" size="small">
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                            API key belum disimpan. Silakan masukkan di bawah atau atur di <a href="#/settings">Settings</a>.
                                        </Text>
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
                                            disabled={!apiKey || !audioBlob}
                                            block
                                        >
                                            Transcribe Now
                                        </Button>
                                    </Card>
                                )}
                            </Flex>
                        </Flex>
                    </Card>
                </Col>

                {/* ======= RIGHT COLUMN: Transcript + AI Summary ======= */}
                <Col xs={24} lg={12}>
                    <TranscriptViewer
                        transcript={transcript}
                        isLoading={isTranscribing}
                        error={error}
                        onSummaryGenerated={setCurrentSummary}
                        sessions={sessions}
                    />
                </Col>
            </Row>

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
                    Durasi: {formatTime(totalRecordingTime)} | {sessionCount} sesi | Transcript: {transcript?.text?.length || 0} karakter
                </Text>
            </Modal>
        </div>
    );
};
