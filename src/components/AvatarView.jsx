import { useState } from 'react';

export function AvatarView({ apiKey, endpoint, model, apiVersion }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState('realistic');
  const [avatarGender, setAvatarGender] = useState('neutral');
  const [avatarAge, setAvatarAge] = useState('adult');

  const validateSettings = () => {
    if (!apiKey?.trim()) {
      setError('Please enter your Azure OpenAI API key in settings');
      return false;
    }
    if (!endpoint?.trim()) {
      setError('Please enter your Azure OpenAI endpoint in settings');
      return false;
    }
    if (!model?.trim()) {
      setError('Please enter your Azure OpenAI model deployment name in settings');
      return false;
    }
    return true;
  };

  const handleGenerateAvatar = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description.trim() || !name.trim()) {
      setError('Please provide both a name and description for your avatar');
      return;
    }
    if (!validateSettings()) return;

    setIsLoading(true);

    try {
      // Using Azure OpenAI for image generation
      const baseEndpoint = endpoint.replace(/\/$/, '');
      const response = await fetch(`${baseEndpoint}/openai/deployments/${model}/images/generations?api-version=${apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          prompt: `Create a profile avatar for a character named ${name} with the following description: ${description}. The avatar should be ${avatarGender}, ${avatarAge} age, and in ${avatarStyle} style. The image should be a close-up portrait with a clean background.`,
          n: 1,
          size: "1024x1024"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setAvatar(data.data[0].url);
      } else {
        throw new Error('No avatar was generated');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while generating the avatar. Please check your Azure OpenAI settings and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {!avatar && !error && !isLoading && (
          <div className="empty-state">
            Create an avatar by providing a name and description. Configure your Azure OpenAI settings to get started.
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {avatar && (
          <div className="avatar-result">
            <h3>{name}</h3>
            <div className="avatar-image-container">
              <img src={avatar} alt={`Avatar for ${name}`} />
            </div>
            <p className="avatar-description">{description}</p>
          </div>
        )}

        {isLoading && (
          <div className="message assistant">
            <div className="message-content thinking">Creating avatar...</div>
          </div>
        )}
      </div>
      
      <form className="chat-input-form" onSubmit={handleGenerateAvatar}>
        <div className="avatar-inputs">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Avatar name"
            disabled={isLoading}
            className="avatar-name-input"
          />
          <div className="chat-input-container">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your avatar's appearance and characteristics"
              disabled={isLoading}
            />
            <div className="chat-input-buttons">
              <button type="button" onClick={() => setShowOptions(!showOptions)} title="Avatar options">⚙️</button>
              <button type="submit" disabled={isLoading} title="Generate avatar">👤</button>
            </div>
          </div>
        </div>
      </form>
      
      {showOptions && (
        <div className="options-menu">
          <div className="avatar-options">
            <label>
              Avatar style:
              <select 
                value={avatarStyle} 
                onChange={(e) => setAvatarStyle(e.target.value)}
                disabled={isLoading}
              >
                <option value="realistic">Realistic</option>
                <option value="cartoon">Cartoon</option>
                <option value="anime">Anime</option>
                <option value="pixel art">Pixel Art</option>
                <option value="3D rendered">3D Rendered</option>
              </select>
            </label>
            <label>
              Gender:
              <select 
                value={avatarGender} 
                onChange={(e) => setAvatarGender(e.target.value)}
                disabled={isLoading}
              >
                <option value="neutral">Neutral</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label>
              Age:
              <select 
                value={avatarAge} 
                onChange={(e) => setAvatarAge(e.target.value)}
                disabled={isLoading}
              >
                <option value="child">Child</option>
                <option value="teen">Teen</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior</option>
              </select>
            </label>
            <button 
              onClick={() => {
                setAvatar(null);
                setName('');
                setDescription('');
              }}
            >
              Clear Avatar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}