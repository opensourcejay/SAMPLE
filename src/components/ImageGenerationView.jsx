import { useState, useEffect } from 'react';

export function ImageGenerationView({ apiKey, endpoint }) {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');  
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [generationHistory, setGenerationHistory] = useState(() => {
    const savedHistory = localStorage.getItem('imageGenerationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('imageGenerationHistory', JSON.stringify(generationHistory));
  }, [generationHistory]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;
    
    setCurrentPrompt(trimmedPrompt);    
    setPrompt('');
    setIsLoading(true);
    setError(null);
    
    try {
      if (!endpoint || !apiKey) {
        throw new Error('Please configure your API settings first');
      }

      const safePrompt = trimmedPrompt.replace(/\b(nude|naked|explicit|nsfw|gore|violent|blood|dead|kill)\b/gi, '');
      if (safePrompt !== trimmedPrompt) {
        setError('Some words in your prompt were removed to comply with content safety guidelines.');
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          prompt: safePrompt,
          n: 1,
          size,
          quality: 'hd',
          response_format: 'url',
          model: 'dall-e-3'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error?.message || `Failed to generate image: ${response.status}`;
        if (errorMessage.toLowerCase().includes('content filter')) {
          throw new Error('Your prompt was flagged by content safety filters. Please rephrase your request to avoid potentially harmful or inappropriate content.');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.data?.[0]?.url) {
        const newImage = {
          id: Date.now(),
          url: data.data[0].url,
          prompt: trimmedPrompt,
          timestamp: new Date().toISOString(),
          size
        };
        setImageUrl(newImage.url);
        setGenerationHistory(prev => [newImage, ...prev]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred while generating the image');
    } finally {
      setIsLoading(false);
      setCurrentPrompt('');
    }
  };

  const handleDelete = (id) => {
    setGenerationHistory(prev => prev.filter(img => img.id !== id));
    if (imageUrl === generationHistory.find(img => img.id === id)?.url) {
      setImageUrl(null);
    }
  };

  const handleDownload = async (url, prompt) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `generated-image-${prompt.slice(0, 30)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };
  const promptHelperText = "What image would you like to create? Please avoid harmful, offensive, or inappropriate content.";

  return (
    <div className="image-generation-layout">
      <div className="chat-container image-main-content">
        <div className="chat-messages">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {!error && !imageUrl && !isLoading && !generationHistory.length && (
            <div className="empty-state">
              <h3>Welcome to AI Image Generation!</h3>
            </div>
          )}
          {currentPrompt && isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <div className="generating-message">
                  Generating image for: "{currentPrompt}"...
                </div>
              </div>
            </div>
          )}
          {imageUrl && (
            <div className="message assistant">
              <div className="message-content">
                <img src={imageUrl} alt="Generated" className="generated-image" />
              </div>
            </div>
          )}
        </div>
        
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <div className="chat-input-container">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={promptHelperText}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={isLoading}
            />
            <div className="chat-input-buttons">
              <select 
                value={size} 
                onChange={(e) => setSize(e.target.value)}
                className="size-select"
                disabled={isLoading}
              >
                <option value="1024x1024">Square</option>
                <option value="1024x1792">Portrait</option>
                <option value="1792x1024">Landscape</option>
              </select>              
              <button 
                type="submit"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? '...' : '➤'}
              </button>
            </div>
          </div>
        </form>
      </div>      
      <div className="image-history-sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Generation History</h3>
          {generationHistory.length > 0 && (
            <button 
              onClick={() => setGenerationHistory([])} 
              className="clear-button"
              title="Clear all history"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="image-history-list">
          {generationHistory.map((image) => (
            <div key={image.id} className="history-item">
              <img 
                src={image.url} 
                alt={image.prompt} 
                className="history-thumbnail"
                onClick={() => setImageUrl(image.url)}
              />
              <div className="history-item-details">
                <p className="history-prompt">{image.prompt}</p>
                <div className="history-actions">
                  <button 
                    onClick={() => handleDownload(image.url, image.prompt)}
                    title="Download Image"
                  >
                    ⬇️
                  </button>
                  <button 
                    onClick={() => handleDelete(image.id)}
                    title="Delete Image"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}