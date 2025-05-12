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

### Chat Configuration
Required settings for the Chat feature:
```
API Key: your-azure-openai-api-key
Endpoint URL: https://your-resource.openai.azure.com
Model Deployment Name: your-model-deployment-name
API Version: 2024-02-15-preview (or your specific version)
```
Note: For Chat, enter the base endpoint URL without any '/openai/responses' or model-specific paths.

### Image Generation Configuration
Required settings for the Image Generation feature:
```
API Key: your-azure-openai-api-key
Full Endpoint URL: https://your-resource.openai.azure.com/openai/deployments/your-dalle3-deployment/images/generations?api-version=2024-02-01
```
Note: For Image Generation, the complete endpoint URL must include the model deployment name and API version.

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
