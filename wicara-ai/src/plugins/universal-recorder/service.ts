// Service to handle audio stream mixing

export interface RecorderSettings {
  includeSystemAudio: boolean;
  selectedSourceId?: string;
}

const SETTINGS_KEY = 'wicara:universal-recorder-settings';

export const getSettings = (): RecorderSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { includeSystemAudio: false };
};

export const saveSettings = (settings: RecorderSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getMixedStream = async (): Promise<MediaStream | null> => {
  const settings = getSettings();
  if (!settings.includeSystemAudio) return null;

  try {
    let displayStream: MediaStream;

    // 1. Get System Audio (via Screen Share)
    if (settings.selectedSourceId && (window as any).electronAPI) {
        // Use Electron specific constraint
        displayStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                // @ts-ignore - Electron specific constraint
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: settings.selectedSourceId
                }
            } as any,
            video: {
                // @ts-ignore
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: settings.selectedSourceId
                }
            } as any
        });
    } else {
        // Standard Browser Picker
        displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
            }
        });
    }

    // Check if user shared audio
    if (displayStream.getAudioTracks().length === 0) {
      // User didn't share audio, stop the stream
      displayStream.getTracks().forEach(track => track.stop());
      throw new Error('System audio not shared. Please check "Share system audio" in the picker.');
    }

    // 2. Get Microphone
    const userStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      }
    });

    // 3. Mix streams using Web Audio API
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    // Add Desktop Audio
    const desktopSource = audioContext.createMediaStreamSource(displayStream);
    desktopSource.connect(destination);

    // Add Mic Audio
    const micSource = audioContext.createMediaStreamSource(userStream);
    micSource.connect(destination);

    // Handle stream cleanup
    const mixedStream = destination.stream;
    
    // When mixed stream stops, stop source streams
    // Note: This is tricky because we return the stream to MediaRecorder
    // We should attach a listener to the mixed tracks?
    // Or just let the caller handle stop() which stops tracks?
    // MediaRecorder.stop() doesn't stop tracks automatically.
    
    // We hook into the stop event of the video track (if user stops sharing)
    displayStream.getVideoTracks()[0].onended = () => {
        // If user stops sharing screen, we should probably stop recording or just continue with mic?
        // For now, let's just keep going but the desktop audio will be silent.
    };

    // Return only audio tracks (remove video from display stream)
    // Actually destination.stream only has audio if we only connected audio sources
    return mixedStream;

  } catch (error) {
    console.error('Error getting mixed stream:', error);
    // Fallback to null or throw
    throw error;
  }
};
