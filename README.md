# S.A.M.P.L.E. - AI Models Demo

**S**howcasing **A**I **M**odels, **P**rototypes, and **L**earning **E**xamples

A React-based application that demonstrates various Azure OpenAI capabilities including chat, image generation, avatars, and voice interactions.

## Features

- 💬 Chat Interface with Azure OpenAI integration
- 🎨 Image Generation (Coming Soon)
- 👤 Avatar Creation (Coming Soon)
- 🎙️ Voice Interaction (Coming Soon)
- 🌗 Dark/Light Theme Support
- 📁 File Upload and Analysis
- ⚙️ Configurable API Settings per Feature
- 🔄 Message Retry Capability
- 💾 Persistent Settings Storage

## Tech Stack

- React 19
- Vite
- Azure OpenAI Services
- ESLint

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- Azure OpenAI Service subscription
- Azure OpenAI API endpoint and key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Configuration

1. Open the application in your browser
2. Click the ⚙️ Settings button in the sidebar
3. Enter your Azure OpenAI credentials:
   - API Key
   - Endpoint
   - Model Name
   - API Version

Settings are saved automatically and persisted in your browser's local storage.

## Project Structure

```
src/
  components/           # React components
    ApiSettingsForm    # API configuration form
    ChatView           # Main chat interface
    SettingsModal      # Settings modal dialog
    Sidebar           # Navigation sidebar
    WorkInProgress    # Placeholder for upcoming features
  App.jsx             # Main application component
  App.css             # Global styles
```

## Development

To build for production:
```bash
npm run build
```

To run linting:
```bash
npm run lint
```

## Contributing

Created by [@opensourcejay](https://github.com/opensourcejay)
