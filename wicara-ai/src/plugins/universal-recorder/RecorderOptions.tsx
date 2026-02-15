import React, { useState, useEffect } from 'react';
import { Switch, Space, Tooltip, Select, Button } from 'antd';
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { getSettings, saveSettings } from './service';

interface DesktopSource {
    id: string;
    name: string;
    thumbnail: string;
}

export const RecorderOptions: React.FC = () => {
  const [includeSystemAudio, setIncludeSystemAudio] = useState(false);
  const [sources, setSources] = useState<DesktopSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | undefined>();
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    const settings = getSettings();
    setIncludeSystemAudio(settings.includeSystemAudio);
    setSelectedSource(settings.selectedSourceId);
    
    // Check if running in Electron
    if ((window as any).electronAPI) {
        setIsElectron(true);
        refreshSources();
    }
  }, []);

  const refreshSources = async () => {
      if ((window as any).electronAPI) {
          try {
            const s = await (window as any).electronAPI.getDesktopSources();
            setSources(s);
          } catch (e) {
              console.error('Failed to get sources', e);
          }
      }
  };

  const handleChange = (checked: boolean) => {
    setIncludeSystemAudio(checked);
    const currentSettings = getSettings();
    saveSettings({ ...currentSettings, includeSystemAudio: checked });
  };

  const handleSourceChange = (val: string) => {
      setSelectedSource(val);
      const currentSettings = getSettings();
      saveSettings({ ...currentSettings, selectedSourceId: val });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
            <Switch 
                checked={includeSystemAudio} 
                onChange={handleChange} 
                checkedChildren="System Audio ON" 
                unCheckedChildren="System Audio OFF"
            />
            <Tooltip title="Enable to record audio from other applications (Browser tabs, Zoom, etc.) alongside your microphone.">
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
        </Space>

        {includeSystemAudio && isElectron && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Select
                    style={{ width: 300 }}
                    placeholder="Select Application Window"
                    options={sources.map(s => ({ label: s.name, value: s.id }))}
                    value={selectedSource}
                    onChange={handleSourceChange}
                    onDropdownVisibleChange={(open) => open && refreshSources()}
                    optionLabelProp="label"
                />
                <Button icon={<ReloadOutlined />} onClick={refreshSources} type="text" />
            </div>
        )}
    </Space>
  );
};
