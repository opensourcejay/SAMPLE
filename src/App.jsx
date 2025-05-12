import { useState, useEffect } from 'react';
import './App.css';
import { ChatView } from './components/ChatView';
import { ImageGenerationView } from './components/ImageGenerationView';
import { AvatarView } from './components/AvatarView';
import { VoiceView } from './components/VoiceView';
import { SearchView } from './components/SearchView';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('Chat');
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('Chat');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const sections = [
    { name: "Chat", icon: "💬" },
    { name: "Image Generation", icon: "🎨" },
    { name: "Avatar", icon: "👤" },
    { name: "Voice", icon: "🎙️" },
    { name: "Search", icon: "🔍" }
  ];
    const [apiSettings, setApiSettings] = useState(() => {
    const savedSettings = localStorage.getItem('apiSettings');
    return savedSettings ? JSON.parse(savedSettings) : {      'Chat': {
        apiKey: '',
        endpoint: '',
        model: '',
        apiVersion: '2024-02-15-preview'
      },
      'Image Generation': {
        apiKey: '',
        endpoint: ''
      },
      'Avatar': {
        apiKey: '',
        endpoint: ''
      },
      'Voice': {
        apiKey: '',
        endpoint: ''
      },
      'Search': {
        apiKey: '',
        endpoint: ''
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('apiSettings', JSON.stringify(apiSettings));
  }, [apiSettings]);

  const handleApiSettingChange = (section, setting, value) => {
    setApiSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };  const handleClearSettings = (section) => {
    setApiSettings(prev => ({
      ...prev,
      [section]: {
        apiKey: '',
        endpoint: '',
        model: section === 'Chat' ? '' : undefined,
        apiVersion: section === 'Chat' ? '2024-02-15-preview' : undefined
      }
    }));
  };  const handleClearAllSettings = () => {
    const clearedSettings = Object.keys(apiSettings).reduce((acc, section) => ({
      ...acc,
      [section]: {
        apiKey: '',
        endpoint: '',
        model: section === 'Chat' ? '' : undefined,
        apiVersion: section === 'Chat' ? '2024-02-15-preview' : undefined
      }
    }), {});
    setApiSettings(clearedSettings);
  };

  const renderContent = () => {
    const currentSettings = apiSettings[activeSection] || {
      apiKey: '',
      endpoint: ''
    };

    switch(activeSection) {      case 'Chat':
        return (
          <ChatView 
            apiKey={currentSettings.apiKey} 
            endpoint={currentSettings.endpoint}
            model={currentSettings.model}
            apiVersion={currentSettings.apiVersion}
          />
        );
      case 'Image Generation':
        return (
          <ImageGenerationView 
            apiKey={currentSettings.apiKey} 
            endpoint={currentSettings.endpoint}
          />
        );
      case 'Avatar':
        return (
          <AvatarView 
            apiKey={currentSettings.apiKey} 
            endpoint={currentSettings.endpoint}
          />
        );
      case 'Voice':
        return (
          <VoiceView 
            apiKey={currentSettings.apiKey} 
            endpoint={currentSettings.endpoint}
          />
        );
      case 'Search':
        return (
          <SearchView 
            apiKey={currentSettings.apiKey} 
            endpoint={currentSettings.endpoint}
          />
        );        default:
        return <ChatView 
          apiKey={currentSettings.apiKey} 
          endpoint={currentSettings.endpoint}
          model={currentSettings.model}
          apiVersion={currentSettings.apiVersion}
        />;
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setShowSettings={setShowSettings}
        sections={sections}
      />
      <div className="content">
        {renderContent()}
      </div>
      <div className="app-footer" />
      
      <SettingsModal
        showSettings={showSettings}
        sections={sections}
        activeSettingsTab={activeSettingsTab}
        setActiveSettingsTab={setActiveSettingsTab}
        apiSettings={apiSettings}
        handleApiSettingChange={handleApiSettingChange}
        handleClearSettings={handleClearSettings}
        handleClearAllSettings={handleClearAllSettings}
        setShowSettings={setShowSettings}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </div>
  );
}

export default App;
