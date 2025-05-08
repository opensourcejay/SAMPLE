export function ApiSettingsForm({
  activeSettingsTab,
  apiSettings,
  handleApiSettingChange,
  handleClearSettings,
  handleClearAllSettings
}) {
  // Add default values if the settings for the current tab don't exist
  const currentSettings = apiSettings[activeSettingsTab] || {
    apiKey: '',
    endpoint: '',
    model: '',
    apiVersion: '2024-12-01-preview'
  };

  // Custom labels and placeholders based on the active tab
  const getFieldProps = (field) => {
    if (activeSettingsTab === 'Avatar') {
      switch (field) {
        case 'apiKey':
          return {
            label: 'Azure OpenAI API Key:',
            placeholder: 'Enter Azure OpenAI API Key'
          };
        case 'endpoint':
          return {
            label: 'Azure OpenAI Endpoint:',
            placeholder: 'e.g., https://{your-resource-name}.openai.azure.com'
          };
        case 'model':
          return {
            label: 'Image Generation Model:',
            placeholder: 'Enter DALL-E 3 deployment name'
          };
        case 'apiVersion':
          return {
            label: 'API Version:',
            placeholder: 'e.g., 2024-12-01-preview'
          };
      }
    }
    
    // Default labels for other tabs
    return {
      apiKey: { label: 'API Key:', placeholder: 'Enter API Key' },
      endpoint: { label: 'Endpoint:', placeholder: 'Enter Endpoint' },
      model: { label: 'Model:', placeholder: 'Enter Model' },
      apiVersion: { label: 'API Version:', placeholder: 'Enter API Version' }
    }[field];
  };

  return (
    <>
      <form className="api-form">
        <label>
          {getFieldProps('apiKey').label}
          <input 
            type="password" 
            placeholder={getFieldProps('apiKey').placeholder}
            value={currentSettings.apiKey}
            onChange={(e) => handleApiSettingChange(activeSettingsTab, 'apiKey', e.target.value)}
          />
        </label>
        <label>
          {getFieldProps('endpoint').label}
          <input 
            type="text" 
            placeholder={getFieldProps('endpoint').placeholder}
            value={currentSettings.endpoint}
            onChange={(e) => handleApiSettingChange(activeSettingsTab, 'endpoint', e.target.value)}
          />
        </label>
        <label>
          {getFieldProps('model').label}
          <input 
            type="text" 
            placeholder={getFieldProps('model').placeholder}
            value={currentSettings.model}
            onChange={(e) => handleApiSettingChange(activeSettingsTab, 'model', e.target.value)}
          />
        </label>
        <label>
          {getFieldProps('apiVersion').label}
          <input 
            type="text" 
            placeholder={getFieldProps('apiVersion').placeholder}
            value={currentSettings.apiVersion}
            onChange={(e) => handleApiSettingChange(activeSettingsTab, 'apiVersion', e.target.value)}
          />
        </label>
        
        {activeSettingsTab === 'Avatar' && (
          <div className="api-form-info">
            <p>
              This avatar generator uses Azure OpenAI's DALL-E models to create profile images based on your description.
              You'll need an Azure OpenAI deployment with image generation capabilities.
            </p>
          </div>
        )}
      </form>
      <div className="settings-modal-buttons">
        <button 
          className="clear-button" 
          onClick={() => handleClearSettings(activeSettingsTab)}
        >
          Clear {activeSettingsTab} Settings
        </button>
        <button 
          className="clear-all-button" 
          onClick={handleClearAllSettings}
        >
          Clear All Settings
        </button>
      </div>
    </>
  );
}