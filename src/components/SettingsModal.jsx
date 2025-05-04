import { ApiSettingsForm } from './ApiSettingsForm';

export function SettingsModal({
  showSettings,
  sections,
  activeSettingsTab,
  setActiveSettingsTab,
  apiSettings,
  handleApiSettingChange,
  handleClearSettings,
  handleClearAllSettings,
  setShowSettings,
  isDarkMode,
  setIsDarkMode
}) {
  return showSettings ? (
    <div className="settings-modal">
      <div className="settings-modal-content">
        <div className="settings-header">
          <h3>API Settings</h3>
          <button 
            className="theme-toggle" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="settings-tabs">
          {sections.map(section => (
            <button
              key={section.name}
              className={`tab-button ${activeSettingsTab === section.name ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab(section.name)}
            >
              {section.icon} {section.name}
            </button>
          ))}
        </div>
        <ApiSettingsForm
          activeSettingsTab={activeSettingsTab}
          apiSettings={apiSettings}
          handleApiSettingChange={handleApiSettingChange}
          handleClearSettings={handleClearSettings}
          handleClearAllSettings={handleClearAllSettings}
        />
        <div className="settings-modal-buttons">
          <button 
            className="save-button"
            onClick={() => setShowSettings(false)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
}