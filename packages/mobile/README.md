# TanukiMCP Atlas Mobile

The mobile companion app for TanukiMCP Atlas, enabling access to AI assistant capabilities from your mobile device by connecting to a desktop instance.

## Features

- Connect to a desktop TanukiMCP Atlas instance via QR code
- Access all LLM capabilities through your desktop's computing resources
- File system isolation - safely work with files on your mobile device
- Media capture and analysis - take photos, record audio, and scan documents with AI analysis
- Full chat history synchronization with the desktop
- Offline functionality for basic tasks

## Technical Overview

TanukiMCP Atlas Mobile is built with React Native and connects to the desktop application via a WebSocket proxy. The mobile app acts as a client, sending requests to the desktop instance and receiving responses. This architecture allows the mobile app to leverage the desktop's computing resources while maintaining a responsive UI on the mobile device.

## Getting Started

### Prerequisites

- Node.js 18+
- React Native development environment
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. Clone the repository
2. Install dependencies
```bash
cd packages/mobile
npm install
```

### Running the app

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

### Building for production

#### iOS
```bash
npm run build:ios
```

#### Android
```bash
npm run build:android
```

## Development

### Project Structure

```
packages/mobile/
├── android/        # Android-specific code
├── ios/            # iOS-specific code
├── src/            # Source code
│   ├── api/        # API clients and WebSocket connection
│   ├── components/ # Reusable components
│   ├── screens/    # Screen components
│   ├── navigation/ # Navigation configuration
│   ├── services/   # Business logic
│   ├── state/      # State management
│   ├── utils/      # Utility functions
│   └── App.tsx     # Entry point
└── index.js        # React Native entry point
```

### Key Technologies

- React Native
- TypeScript
- React Navigation
- Async Storage
- React Native WebSocket
- React Native Camera
- React Native File System

## Connecting to Desktop

1. Open the TanukiMCP Atlas desktop application
2. Enable the mobile proxy in the toolbar
3. Launch the mobile app
4. Scan the QR code displayed on the desktop
5. The connection will be established automatically

## Working with Files

Files on your mobile device are accessible only to the mobile app. When you share files with the AI assistant, they are temporarily uploaded to the desktop instance for processing, then the results are sent back to the mobile app. The original files remain on your mobile device.

## Media Processing

The mobile app can capture photos, videos, and audio. These media files can be processed by the AI assistant for various tasks such as:

- OCR (Optical Character Recognition)
- Image analysis
- Speech-to-text transcription
- Document scanning

## Security

- All communication between the mobile app and desktop is encrypted
- Authentication uses secure tokens that expire after use
- File system isolation ensures that mobile files stay on the mobile device
- No data is stored on remote servers

## Troubleshooting

If you encounter connection issues:
1. Ensure both devices are on the same network
2. Check that the desktop proxy is enabled
3. Verify that no firewall is blocking the connection
4. Try regenerating the QR code
5. Restart both the desktop and mobile applications

## License

See the LICENSE file in the root directory. 