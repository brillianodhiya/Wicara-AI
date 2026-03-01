import React, { useState, useEffect, useRef } from 'react';
import { Typography, Button, Card, Space, Modal, Input, Tooltip } from 'antd';
import { AudioOutlined, SettingOutlined, PauseCircleOutlined, ThunderboltOutlined, SaveOutlined } from '@ant-design/icons';
import { useRealtimeTranscription } from '../hooks/useRealtimeTranscription';
import { useMeetings } from '../hooks/useMeetings';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

export const RealtimePage: React.FC = () => {
  const [workerUrl, setWorkerUrl] = useState(() => localStorage.getItem('wicara:cf-worker-url') || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { isRecording, isConnecting, transcripts, startRecording, stopRecording, fullText } = useRealtimeTranscription();
  const { addMeeting } = useMeetings();
  const navigate = useNavigate();
  const textEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of transcripts
  useEffect(() => {
    if (textEndRef.current) {
        textEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts]);

  const handleSaveSettings = () => {
    localStorage.setItem('wicara:cf-worker-url', workerUrl);
    setIsSettingsOpen(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (!workerUrl) {
        setIsSettingsOpen(true);
        return;
      }
      startRecording(workerUrl);
    }
  };

  const handleSaveMeeting = () => {
    if (!fullText) return;
    
    addMeeting({
        title: `Realtime Session - ${new Date().toLocaleString()}`,
        duration: 0, // Duration tracking omitted for simplicity in Realtime Mode
        audioUrl: '', // No combined audio saved in MVP realtime chunking
        status: 'completed',
        transcript: {
            text: fullText,
            utterances: []
        }
    });

    navigate('/history');
  };

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space align="center">
            <Title level={3} style={{ margin: 0 }}>
              <ThunderboltOutlined style={{ color: '#faad14', marginRight: 8 }} />
              Realtime AI
            </Title>
            {isRecording && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
                    <div className="recording-pulse" style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff4d4f' }} />
                    <Text type="danger" strong>Live</Text>
                </div>
            )}
        </Space>
        
        <Space>
            <Tooltip title="Configure Cloudflare Engine">
                <Button 
                    icon={<SettingOutlined />} 
                    onClick={() => setIsSettingsOpen(true)}
                    type="dashed"
                />
            </Tooltip>
            
            <Button
                type={isRecording ? "default" : "primary"}
                danger={isRecording}
                size="large"
                shape="round"
                icon={isRecording ? <PauseCircleOutlined /> : <AudioOutlined />}
                onClick={toggleRecording}
                loading={isConnecting}
            >
                {isRecording ? 'Stop' : 'Start Dictation'}
            </Button>

            {!isRecording && fullText.length > 0 && (
                <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    size="large"
                    shape="round"
                    onClick={handleSaveMeeting}
                >
                    Save Note
                </Button>
            )}
        </Space>
      </div>

      {/* Main Text Area */}
      <Card 
        style={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0',
            overflow: 'hidden'
        }}
        bodyStyle={{ flexGrow: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column' }}
      >
        {transcripts.length === 0 && !isRecording && !isConnecting ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#bfbfbf', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <ThunderboltOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
                <Title level={4} style={{ color: '#8c8c8c' }}>Ready to listen</Title>
                <Text>Press Start and speak naturally. Text will appear here in near real-time.</Text>
            </div>
        ) : (
            <>
                <Paragraph style={{ fontSize: 18, lineHeight: 1.8, color: '#262626' }}>
                    {transcripts.map((t, idx) => (
                        <span key={idx} style={{ marginRight: 6 }}>{t}</span>
                    ))}
                    {isRecording && <span className="cursor-blink" style={{ display: 'inline-block', width: 2, height: 20, background: '#1677ff', verticalAlign: 'middle', marginLeft: 4 }} />}
                </Paragraph>
                <div ref={textEndRef} style={{ height: 10 }} />
            </>
        )}
      </Card>

      {/* Settings Modal */}
      <Modal
        title={<span><ThunderboltOutlined style={{ color: '#faad14' }} /> Cloudflare Engine Setup</span>}
        open={isSettingsOpen}
        onOk={handleSaveSettings}
        onCancel={() => setIsSettingsOpen(false)}
        okText="Save Engine URL"
      >
         <div style={{ marginBottom: 16 }}>
             <Paragraph type="secondary">
                 To use Realtime AI, you need to deploy the Wicara AI Cloudflare Worker script. This allows you to use the Whisper AI model on Cloudflare's edge network for free (up to 10k requests/day).
             </Paragraph>
         </div>
         <div>
             <Text strong>Worker URL (Endpoint)</Text>
             <Input 
                placeholder="https://my-whisper-worker.username.workers.dev" 
                value={workerUrl}
                onChange={e => setWorkerUrl(e.target.value)}
                style={{ marginTop: 8 }}
             />
         </div>
         <div style={{ marginTop: 16 }}>
             <Text type="secondary" style={{ fontSize: 12 }}>
                 Note: The realtime feature cuts your audio into 3-second chunks and processes them continuously. Some words split exactly on the 3-second mark might be slightly inaccurate.
             </Text>
         </div>
      </Modal>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor-blink { animation: blink 1s step-end infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 77, 79, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); } }
        .recording-pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
};
