import { useState, useEffect } from 'react';

export function ChatView({ apiKey, endpoint, model, apiVersion = '2024-03-01-preview' }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [failedMessageIndex, setFailedMessageIndex] = useState(null);
  const [customPrompt, setCustomPrompt] = useState(() => {
    const savedPrompt = localStorage.getItem('customPrompt');
    return savedPrompt || 'Be helpful and provide detailed explanations';
  });
  const [editingPrompt, setEditingPrompt] = useState('');
  const [showPromptEditor, setShowPromptEditor] = useState(false);

  useEffect(() => {
    localStorage.setItem('customPrompt', customPrompt);
  }, [customPrompt]);

  const handleSavePrompt = () => {
    setCustomPrompt(editingPrompt);
    setShowPromptEditor(false);
    setEditingPrompt('');
  };

  const validateSettings = () => {
    if (!apiKey?.trim()) {
      setError('Please enter your API key in settings');
      return false;
    }
    // Clean up endpoint URL
    const cleanEndpoint = endpoint?.trim()?.replace(/\/openai\/.*$/, '')?.replace(/\/$/, '');
    if (!cleanEndpoint) {
      setError('Please enter your Azure OpenAI endpoint in settings');
      return false;
    }
    if (!model?.trim()) {
      setError('Please enter your model deployment name in settings');
      return false;
    }
    return true;
  };

  const getCleanEndpoint = () => {
    let cleanEndpoint = endpoint?.trim() || '';
    // Remove any trailing /openai/ or /deployments/ paths
    cleanEndpoint = cleanEndpoint.replace(/\/openai\/.*$/, '');
    cleanEndpoint = cleanEndpoint.replace(/\/deployments\/.*$/, '');
    // Remove trailing slashes
    cleanEndpoint = cleanEndpoint.replace(/\/$/, '');
    return cleanEndpoint;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError(null);
    setFailedMessageIndex(null);

    if (!inputMessage.trim() && !fileContent) return;
    if (!validateSettings()) return;

    // Create the visible message for the chat
    const displayMessage = {
      role: 'user',
      content: inputMessage.trim() || (uploadedFile ? `Analyzing file: ${uploadedFile.name}` : '')
    };

    // Create the full message for the API that includes the file content
    const apiMessage = {
      role: 'user',
      content: displayMessage.content + (fileContent ? `\n\nFile contents:\n${fileContent}` : '')
    };

    // Add only the display message to the chat
    setMessages(prev => [...prev, displayMessage]);
    setInputMessage('');
    setFileContent(null);
    setUploadedFile(null);
    setIsLoading(true);

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    while (retryCount < maxRetries) {
      try {
        const baseEndpoint = getCleanEndpoint();
        const apiUrl = `${baseEndpoint}/openai/deployments/${model}/chat/completions`;
        
        const response = await fetch(`${apiUrl}?api-version=${apiVersion}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: `You are a helpful AI assistant. ${customPrompt}

Format your responses using clean, simple HTML structure:
<p>
[Your response here]
</p>

Note: Focus on answering questions directly without mentioning training details or cutoff dates.`
              },
              ...messages.map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              apiMessage // Use the API message that includes file content
            ],
            temperature: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_completion_tokens: 800
          }),
        });

        if (response.status === 503) {
          console.log(`Attempt ${retryCount + 1}: Service unavailable, retrying...`);
          retryCount++;
          if (retryCount === maxRetries) {
            throw new Error('Service is temporarily unavailable. Please try again later.');
          }
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`;
          console.error('API Error:', errorData);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!data.choices?.[0]?.message) {
          throw new Error('Invalid response format from API');
        }

        const assistantMessage = {
          role: 'assistant',
          content: data.choices[0].message.content
        };

        setMessages(prev => [...prev, assistantMessage]);
        break; // Success, exit the retry loop

      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        if (retryCount === maxRetries - 1) {
          setError(error.message || 'An error occurred while connecting to Azure OpenAI. Please try again later.');
          setFailedMessageIndex(messages.length);
          break;
        }
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    setIsLoading(false);
  };

  const handleRetry = async (index) => {
    setError(null);
    setFailedMessageIndex(null);
    setIsLoading(true);

    // Get the failed message
    const failedMessage = messages[index];
    if (!failedMessage) {
      setError('Could not find the message to retry');
      setIsLoading(false);
      return;
    }

    // Remove all messages after the failed one
    setMessages(prev => prev.slice(0, index));

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;

    while (retryCount < maxRetries) {
      try {
        const baseEndpoint = getCleanEndpoint();
        const apiUrl = `${baseEndpoint}/openai/deployments/${model}/chat/completions`;
        
        const response = await fetch(`${apiUrl}?api-version=${apiVersion}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: `You are a helpful AI assistant. ${customPrompt}

Format your responses using clean, simple HTML structure:
<p>
[Your response here]
</p>

Note: Focus on answering questions directly without mentioning training details or cutoff dates.`
              },
              ...messages.slice(0, index),
              failedMessage
            ],
            temperature: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_completion_tokens: 800
          }),
        });

        if (response.status === 503) {
          console.log(`Retry attempt ${retryCount + 1}: Service unavailable, retrying...`);
          retryCount++;
          if (retryCount === maxRetries) {
            throw new Error('Service is temporarily unavailable. Please try again later.');
          }
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`;
          console.error('API Error:', errorData);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!data.choices?.[0]?.message) {
          throw new Error('Invalid response format from API');
        }

        const assistantMessage = {
          role: 'assistant',
          content: data.choices[0].message.content
        };

        setMessages(prev => [...prev, assistantMessage]);
        break; // Success, exit the retry loop

      } catch (error) {
        console.error(`Retry attempt ${retryCount + 1} failed:`, error);
        if (retryCount === maxRetries - 1) {
          setError(error.message || 'An error occurred while connecting to Azure OpenAI. Please try again later.');
          setFailedMessageIndex(index);
          break;
        }
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    setIsLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type || 'text/plain';
    const reader = new FileReader();
    
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setUploadedFile(file);
    };
    
    if (fileType.includes('text') || fileType === 'application/pdf' || fileType === 'application/json') {
      reader.readAsText(file);
    } else {
      setError('Unsupported file type. Please upload a text, PDF, or JSON file.');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && !error && (
          <div className="empty-state">
            Hello! I'm here to help. Configure your Azure OpenAI settings to get started.
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              {message.role === 'assistant' 
                ? <div className="formatted-response" dangerouslySetInnerHTML={{ __html: message.content }} />
                : message.content
              }
              {index === failedMessageIndex && (
                <button 
                  className="retry-button" 
                  onClick={() => handleRetry(index)}
                  title="Retry sending message"
                >
                  🔄
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content thinking">...</div>
          </div>
        )}
      </div>
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="chat-input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={uploadedFile ? "Press Enter to analyze the file or add a message" : "Ask anything"}
            disabled={isLoading}
          />
          <div className="chat-input-buttons">
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <div className="file-upload-container">
              {uploadedFile ? (
                <div className="file-indicator" title={uploadedFile.name}>
                  📄 <span className="file-name">{uploadedFile.name}</span>
                  <button 
                    type="button" 
                    className="remove-file" 
                    onClick={() => {
                      setFileContent(null);
                      setUploadedFile(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => document.getElementById('file-upload').click()} 
                  title="Add content"
                >
                  +
                </button>
              )}
            </div>
            <button type="button" onClick={() => setShowOptions(!showOptions)} title="More options">⋮</button>
          </div>
        </div>
      </form>
      
      {showOptions && (
        <div className="options-menu">
          <button onClick={() => setMessages([])}>Clear Chat</button>
          {!showPromptEditor ? (
            <div className="prompt-section">
              <div className="current-prompt">
                <p>Current Response Style:</p>
                <p className="prompt-text">{customPrompt}</p>
              </div>
              <button onClick={() => {
                setEditingPrompt(customPrompt);
                setShowPromptEditor(true);
              }}>Edit Response Style</button>
            </div>
          ) : (
            <div className="prompt-editor">
              <textarea
                value={editingPrompt}
                onChange={(e) => setEditingPrompt(e.target.value)}
                placeholder="How should I respond? (e.g., 'Be clear and concise')"
              />
              <div className="prompt-editor-buttons">
                <button onClick={handleSavePrompt}>Save</button>
                <button onClick={() => setShowPromptEditor(false)}>Cancel</button>
              </div>
            </div>
          )}
          <div className="prompt-guidance">
            <p>💡 Tip: Be specific in your questions. For example:</p>
            <ul>
              <li>"Analyze this code for potential bugs"</li>
              <li>"Explain how this function works"</li>
              <li>"What are the best practices for this pattern?"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}