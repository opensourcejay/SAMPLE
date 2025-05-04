export function Sidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activeSection, 
  setActiveSection, 
  setShowSettings, 
  sections 
}) {
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button 
          className="hamburger-button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <h2>S.A.M.P.L.E.</h2>
      </div>
      <div className="sidebar-subtitle">
        <span>Showcasing AI Models, Prototypes, and Learning Examples</span>
      </div>
      <ul className="sidebar-menu">
        {sections.map((section) => (
          <li
            key={section.name}
            className={activeSection === section.name ? 'active' : ''}
            onClick={() => setActiveSection(section.name)}
          >
            <i>{section.icon}</i>
            <span>{section.name}</span>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button 
          className="settings-button"
          onClick={() => setShowSettings(true)}
        >
          <span>⚙️</span>
          <span className="settings-button-text">API Settings</span>
        </button>
        <div className="creator-attribution">
          <a href="https://github.com/opensourcejay" target="_blank" rel="noopener noreferrer">
            Created by @opensourcejay
          </a>
        </div>
      </div>
    </div>
  );
}