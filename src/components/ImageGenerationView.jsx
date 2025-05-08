import { useState } from 'react';

export function ImageGenerationView({ apiKey, endpoint, model, apiVersion }) {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageSize, setImageSize] = useState('1024x1024');
  const [imageCount, setImageCount] = useState(1);
  const [showOptions, setShowOptions] = useState(false);

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

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    setError(null);

    if (!prompt.trim()) return;
    if (!validateSettings()) return;

    setIsLoading(true);

    try {
      const baseEndpoint = endpoint.replace(/\/$/, '');
      const response = await fetch(`${baseEndpoint}/openai/deployments/${model}/images/generations?api-version=${apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          prompt: prompt,
          n: parseInt(imageCount),
          size: imageSize
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedImages(data.data.map(img => img.url));
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while generating images. Please check your settings and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {generatedImages.length === 0 && !error && !isLoading && (
          <div className="empty-state">
            Describe the image you'd like to generate. Configure your Azure OpenAI settings to get started.
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="generated-images-container">
          {generatedImages.map((imageUrl, index) => (
            <div key={index} className="generated-image">
              <img src={imageUrl} alt={`Generated image ${index + 1}`} />
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="message assistant">
            <div className="message-content thinking">Generating image...</div>
          </div>
        )}
      </div>
      
      <form className="chat-input-form" onSubmit={handleGenerateImage}>
        <div className="chat-input-container">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate"
            disabled={isLoading}
          />
          <div className="chat-input-buttons">
            <button type="button" onClick={() => setShowOptions(!showOptions)} title="Image options">⚙️</button>
            <button type="submit" disabled={isLoading} title="Generate">🎨</button>
          </div>
        </div>
      </form>
      
      {showOptions && (
        <div className="options-menu">
          <div className="image-options">
            <label>
              Image size:
              <select 
                value={imageSize} 
                onChange={(e) => setImageSize(e.target.value)}
                disabled={isLoading}
              >
                <option value="256x256">Small (256x256)</option>
                <option value="512x512">Medium (512x512)</option>
                <option value="1024x1024">Large (1024x1024)</option>
                <option value="1792x1024">Wide (1792x1024)</option>
                <option value="1024x1792">Tall (1024x1792)</option>
              </select>
            </label>
            <label>
              Number of images:
              <select 
                value={imageCount} 
                onChange={(e) => setImageCount(e.target.value)}
                disabled={isLoading}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>
            <button onClick={() => setGeneratedImages([])}>Clear Images</button>
          </div>
        </div>
      )}
    </div>
  );
}