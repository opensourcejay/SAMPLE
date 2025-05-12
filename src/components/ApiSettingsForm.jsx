export function ApiSettingsForm({
  activeSettingsTab,
  apiSettings,
  handleApiSettingChange,
  handleClearSettings,
  handleClearAllSettings
}) {
  const currentSettings = apiSettings[activeSettingsTab] || {
    apiKey: '',
    endpoint: '',
    model: '',
    apiVersion: '2024-02-15-preview'
  };

  const endpointPlaceholder = activeSettingsTab === 'Image Generation'
    ? "Enter your complete Azure OpenAI endpoint URL for DALL-E"
    : "Enter your Azure OpenAI endpoint URL";

  const handleEndpointChange = (e) => {
    let value = e.target.value;
    // For Chat, clean up the endpoint URL by removing the /openai/responses part
    if (activeSettingsTab === 'Chat') {
      value = value.replace(/\/openai\/responses.*$/, '');
      value = value.replace(/\/openai\/deployments.*$/, '');
      value = value.replace(/\/$/, '');
    }
    handleApiSettingChange(activeSettingsTab, 'endpoint', value);
  };

  return (
    <>
      <form className="api-form">
        <label>
          API Key:
          <input 
            type="password" 
            placeholder="Enter your Azure OpenAI API Key"
            value={currentSettings.apiKey}
            onChange={(e) => handleApiSettingChange(activeSettingsTab, 'apiKey', e.target.value)}
          />
        </label>
        <label>
          {activeSettingsTab === 'Image Generation' ? 'Full Endpoint URL:' : 'Endpoint URL:'}
          <input 
            type="text" 
            placeholder={endpointPlaceholder}
            value={currentSettings.endpoint}
            onChange={handleEndpointChange}
          />
        </label>

        {activeSettingsTab === 'Chat' && (
          <>
            <label>
              Model Deployment Name:
              <input 
                type="text" 
                placeholder="Enter your model deployment name"
                value={currentSettings.model}
                onChange={(e) => handleApiSettingChange(activeSettingsTab, 'model', e.target.value)}
              />
            </label>
            <label>
              API Version:
              <input 
                type="text" 
                placeholder="Enter API version"
                value={currentSettings.apiVersion}
                onChange={(e) => handleApiSettingChange(activeSettingsTab, 'apiVersion', e.target.value)}
              />
            </label>
            <div className="api-form-info">
              <p>Configure your Azure OpenAI service settings for Chat.</p>
            </div>
          </>
        )}
        {activeSettingsTab === 'Image Generation' && (
          <div className="api-form-info">
            <p>Configure your Azure OpenAI DALL-E 3 service settings.</p>
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