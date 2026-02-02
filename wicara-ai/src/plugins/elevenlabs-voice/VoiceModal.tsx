import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Input, Space, message, Divider, Alert } from 'antd';
import { SoundOutlined, DownloadOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { getVoices, textToSpeech, downloadAudio, playAudio, type Voice } from './service';

const { TextArea } = Input;

interface VoiceModalProps {
  open: boolean;
  onClose: () => void;
  initialText?: string;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ open, onClose, initialText = '' }) => {
  const [apiKey, setApiKey] = useState('');
  const [text, setText] = useState(initialText);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loadingVoices, setLoadingVoices] = useState(false);

  // Load saved API key from Settings or fallback to plugin-specific storage
  useEffect(() => {
    // First try centralized settings (from Settings page)
    const settingsData = localStorage.getItem('wicara_api_keys');
    if (settingsData) {
      try {
        const parsed = JSON.parse(settingsData);
        if (parsed.elevenlabs) {
          setApiKey(parsed.elevenlabs);
          return;
        }
      } catch {}
    }
    // Fallback to plugin-specific storage
    const savedKey = localStorage.getItem('wicara:elevenlabs-key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [open]);

  // Update text when initialText changes
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleLoadVoices = async () => {
    if (!apiKey) {
      message.warning('Please enter your ElevenLabs API key');
      return;
    }

    setLoadingVoices(true);
    try {
      const fetchedVoices = await getVoices(apiKey);
      setVoices(fetchedVoices);
      if (fetchedVoices.length > 0) {
        setSelectedVoice(fetchedVoices[0].voice_id);
      }
      // Save API key for future use
      localStorage.setItem('wicara:elevenlabs-key', apiKey);
      message.success(`Loaded ${fetchedVoices.length} voices`);
    } catch (err) {
      message.error('Failed to load voices. Check your API key.');
    } finally {
      setLoadingVoices(false);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      message.warning('Please enter text to convert');
      return;
    }
    if (!selectedVoice) {
      message.warning('Please select a voice');
      return;
    }

    setLoading(true);
    try {
      const blob = await textToSpeech(apiKey, text, selectedVoice);
      setAudioBlob(blob);
      message.success('Audio generated!');
    } catch (err) {
      message.error('Failed to generate audio');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (audioBlob) {
      playAudio(audioBlob);
    }
  };

  const handleDownload = () => {
    if (audioBlob) {
      downloadAudio(audioBlob, `voice-output-${Date.now()}.mp3`);
    }
  };

  return (
    <Modal
      title="🎙️ ElevenLabs Voice Generation"
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Alert
          message="BYOK: Masukkan API Key ElevenLabs Anda"
          description="API key disimpan di browser Anda dan tidak dikirim ke server kami."
          type="info"
          showIcon
        />

        <Input.Password
          placeholder="ElevenLabs API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          addonAfter={
            <Button
              type="link"
              size="small"
              loading={loadingVoices}
              onClick={handleLoadVoices}
              style={{ margin: -7 }}
            >
              Load Voices
            </Button>
          }
        />

        {voices.length > 0 && (
          <>
            <Select
              placeholder="Select Voice"
              value={selectedVoice}
              onChange={setSelectedVoice}
              style={{ width: '100%' }}
              options={voices.map(v => ({
                value: v.voice_id,
                label: `${v.name} (${v.labels.accent || v.category})`,
              }))}
            />

            <TextArea
              placeholder="Enter text to convert to speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={5000}
              showCount
            />

            <Button
              type="primary"
              icon={<SoundOutlined />}
              loading={loading}
              onClick={handleGenerate}
              block
              size="large"
            >
              Generate Voice
            </Button>
          </>
        )}

        {audioBlob && (
          <>
            <Divider>Audio Ready</Divider>
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<PlayCircleOutlined />} onClick={handlePlay} size="large">
                Play
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleDownload} size="large">
                Download MP3
              </Button>
            </Space>
          </>
        )}
      </Space>
    </Modal>
  );
};
