export function WorkInProgress({ feature }) {
  return (
    <div className="work-in-progress-container">
      <div className="work-in-progress">
        <div className="wip-content">
          <h3>{feature}</h3>
          <p>This feature is currently under development.</p>
          <p>Stay tuned for updates!</p>
        </div>
        <div className="chat-input-form">
          <div className="chat-input-container disabled">
            <input
              type="text"
              placeholder="Feature not available yet"
              disabled
            />
            <div className="chat-input-buttons">
              <button type="button" disabled>+</button>
              <button type="button" disabled>🖼️</button>
              <button type="button" disabled>⋮</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}