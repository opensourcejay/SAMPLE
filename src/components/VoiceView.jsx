import { useState, useRef } from 'react';

export function VoiceView({ apiKey, endpoint, model, apiVersion }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [voice, setVoice] = useState('alloy');
  const audioRef = useRef(null);

  const validateSettings = () => {
    if (!apiKey?.trim()) {
      setError('Please enter your API key in settings');
      return false;
    }
    if (!endpoint?.trim()) {
      setError('Please enter your Azure OpenAI endpoint in settings');
      return false;
    }
    if (!model?.trim()) {
      setError('Please enter your model deployment name in settings');
      return false;
    }
    return true;
  };

  const handleGenerateVoice = async (e) => {
    e.preventDefault();
    setError(null);

    if (!text.trim()) return;
    if (!validateSettings()) return;

    setIsLoading(true);
    setAudioUrl(null);

    try {
      const baseEndpoint = endpoint.replace(/\/$/, '');
      const response = await fetch(`${baseEndpoint}/openai/deployments/${model}/audio/speech?api-version=${apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          input: text,
          voice: voice,
          response_format: "mp3"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`);
      }

      // Create audio blob from response
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while generating speech. Please check your settings and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages voice-content">
        {!audioUrl && !error && !isLoading && (
          <div className="empty-state">
            Enter text to convert to speech. Configure your Azure OpenAI settings to get started.
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {text && (
          <div className="voice-text-display">
            <h3>Text to Speech</h3>
            <p className="voice-text">{text}</p>
            
            {audioUrl && (
              <div className="audio-player">
                <audio ref={audioRef} controls src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="message assistant">
            <div className="message-content thinking">Generating audio...</div>
          </div>
        )}
      </div>
      
      <form className="chat-input-form" onSubmit={handleGenerateVoice}>
        <div className="chat-input-container">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech"
            disabled={isLoading}
          />
          <div className="chat-input-buttons">
            <button type="button" onClick={() => setShowOptions(!showOptions)} title="Voice options">⚙️</button>
            <button type="submit" disabled={isLoading} title="Generate speech">🎙️</button>
          </div>
        </div>
      </form>
      
      {showOptions && (
        <div className="options-menu">
          <div className="voice-options">
            <label>
              Voice:
              <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)}
                disabled={isLoading}
              >
                <option value="alloy">Alloy</option>
                <option value="echo">Echo</option>
                <option value="fable">Fable</option>
                <option value="onyx">Onyx</option>
                <option value="nova">Nova</option>
                <option value="shimmer">Shimmer</option>
              </select>
            </label>
            <button 
              onClick={() => {
                setAudioUrl(null);
                setText('');
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}