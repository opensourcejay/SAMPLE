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

  return (
    <>
      <form className="api-form">
        <label>
          API Key:
          <input 
            type="password" 
            placeholder="Enter API Key" 
            value={currentSettings.apiKey}
            onChange={(e) => handleApiSettingChange(activeSettingsTab, 'apiKey', e.target.value)}
          />
        </label>
        <label>
          Endpoint:
          <input 
            type="text" 
            placeholder="Enter Endpoint" 
            value={currentSettings.endpoint}
            onChange={(e) => handleApiSettingChange(activeSettingsTab, 'endpoint', e.target.value)}
          />
        </label>
        <label>
          Model:
          <input 
            type="text" 
            placeholder="Enter Model" 
            value={currentSettings.model}
            onChange={(e) => handleApiSettingChange(activeSettingsTab, 'model', e.target.value)}
          />
        </label>
        <label>
          API Version:
          <input 
            type="text" 
            placeholder="Enter API Version" 
            value={currentSettings.apiVersion}
            onChange={(e) => handleApiSettingChange(activeSettingsTab, 'apiVersion', e.target.value)}
          />
        </label>
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