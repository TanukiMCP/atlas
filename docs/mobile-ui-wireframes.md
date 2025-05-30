# TanukiMCP Atlas Mobile UI Wireframes

## Overview

TanukiMCP Atlas Mobile provides a seamless companion experience to the desktop application through a proxy connection. The mobile interface emphasizes usability on smaller screens while maintaining access to the core AI capabilities of the desktop application.

## Connection & Onboarding Screens

### Initial Launch Screen

```
┌──────────────────────────────────────────┐
│                                          │
│               🦝                         │
│                                          │
│         TanukiMCP Atlas Mobile           │
│                                          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │     Connect to Desktop Atlas       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │       Continue in Local Mode       │  │
│  └────────────────────────────────────┘  │
│                                          │
│                                          │
│  New to TanukiMCP Atlas? Learn More →    │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

### QR Code Scanner

```
┌──────────────────────────────────────────┐
│ ← Back                                   │
│                                          │
│         Scan Desktop QR Code             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  │       [Camera Viewfinder]          │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Position the QR code from your desktop  │
│  Atlas application in the viewfinder     │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │        Enter Code Manually         │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### Connection Success

```
┌──────────────────────────────────────────┐
│                                          │
│               ✓                          │
│                                          │
│         Connection Successful!           │
│                                          │
│  Connected to:                           │
│  Atlas Desktop [User's PC Name]          │
│                                          │
│  Connection details:                     │
│  • Local Network                         │
│  • AES-256 Encrypted                     │
│  • File Systems: Isolated                │
│                                          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │         Continue to Chat           │  │
│  └────────────────────────────────────┘  │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

## Main Chat Interface

### Mobile Chat View

```
┌──────────────────────────────────────────┐
│ 🦝 Atlas Mobile      [User]    ⚙️         │
│ ◀ Desktop Connection Active      📱↔️🖥️  │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────┐      │
│  │ Hi! How can I help you today?  │      │
│  └────────────────────────────────┘      │
│                                          │
│      ┌─────────────────────────────┐     │
│      │ Can you analyze this image  │     │
│      │ of my garden and identify   │     │
│      │ the plants?                 │     │
│      └─────────────────────────────┘     │
│                                          │
│  ┌───────────────────────────────────┐   │
│  │ [Image: Garden.jpg]               │   │
│  │                                   │   │
│  │ I can see several plants in your  │   │
│  │ garden image:                     │   │
│  │                                   │   │
│  │ 1. Tomato plants (left side)      │   │
│  │ 2. Basil (center foreground)      │   │
│  │ 3. Rosemary (right corner)        │   │
│  │ 4. What appears to be mint        │   │
│  │    (bottom edge)                  │   │
│  │                                   │   │
│  │ The tomato plants show signs of   │   │
│  │ needing water. The basil looks    │   │
│  │ healthy and ready for harvest.    │   │
│  └───────────────────────────────────┘   │
│                                          │
├──────────────────────────────────────────┤
│  📎 ┌─────────────────────────┐ 🎙️  📷   │
│     │ Message...              │          │
│     └─────────────────────────┘   ▶      │
└──────────────────────────────────────────┘
```

### Media Capture Interface

```
┌──────────────────────────────────────────┐
│ ← Back                Camera             │
│                                          │
│                                          │
│                                          │
│                                          │
│                                          │
│         [Camera Viewfinder]              │
│                                          │
│                                          │
│                                          │
│                                          │
│                                          │
│                                          │
│                                          │
├──────────────────────────────────────────┤
│       🔄           📷           🎥        │
│   Switch Cam     Capture      Video      │
│                                          │
└──────────────────────────────────────────┘
```

### Media Upload Options

```
┌──────────────────────────────────────────┐
│ ← Back                                   │
│                                          │
│           Upload Media                   │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  📷  Take Photo                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  🎥  Record Video                  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  🖼️  Choose from Gallery          │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  📄  Browse Documents              │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  🎙️  Record Audio                 │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### Media Processing

```
┌──────────────────────────────────────────┐
│ ← Back                                   │
│                                          │
│           Processing Media...            │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │          [Image Preview]           │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Steps:                                  │
│  ✓ Uploading to desktop                  │
│  ✓ Analyzing content                     │
│  → Processing with AI                    │
│  ○ Generating response                   │
│                                          │
│  This might take a moment. Your media    │
│  is being processed on your desktop      │
│  for enhanced results.                   │
│                                          │
│  [==============      ] 65%              │
│                                          │
└──────────────────────────────────────────┘
```

## File Management

### Mobile Files View

```
┌──────────────────────────────────────────┐
│ 🦝 Atlas Mobile      [User]    ⚙️         │
│ Files                             📱      │
├──────────────────────────────────────────┤
│                                          │
│  📁 My Mobile Files                      │
│  ├─ 📁 Documents                         │
│  ├─ 📁 Images                            │
│  │  ├─ 📷 Garden.jpg                     │
│  │  ├─ 📷 Receipt_May12.jpg              │
│  │  └─ 📷 Whiteboard_Meeting.jpg         │
│  ├─ 📁 Videos                            │
│  └─ 📁 Recordings                         │
│                                          │
│  Recently Used                           │
│  ┌────────────────────────────────────┐  │
│  │ 📷 Garden.jpg           Today ↗️   │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ 📄 Notes.txt           Yesterday ↗️│  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌──────────────────────┐                │
│  │ + New File           │                │
│  └──────────────────────┘                │
│                                          │
└──────────────────────────────────────────┘
```

### File Upload Dialog

```
┌──────────────────────────────────────────┐
│                                          │
│          Upload to Chat?                 │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │         [Garden.jpg]               │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Add a message with this file:           │
│  ┌────────────────────────────────────┐  │
│  │ Can you identify these plants?     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────┐ ┌──────────────┐ │
│  │      Cancel        │ │    Upload    │ │
│  └────────────────────┘ └──────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

## Settings & Connection Management

### Connection Status Panel

```
┌──────────────────────────────────────────┐
│ ← Back                                   │
│                                          │
│        Desktop Connection                │
│                                          │
│  Status: Connected 🟢                    │
│                                          │
│  Desktop: User's PC (192.168.1.45)       │
│  Connection type: Local WiFi             │
│  Latency: 35ms                           │
│  Last connected: Just now                │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │      Test Connection               │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │      Disconnect                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Previous Connections:                   │
│  • Home Desktop (Last: Yesterday)        │
│  • Work Laptop (Last: 3 days ago)        │
│                                          │
└──────────────────────────────────────────┘
```

### Mobile Settings

```
┌──────────────────────────────────────────┐
│ ← Back                                   │
│                                          │
│              Settings                    │
│                                          │
│  Application                             │
│  ┌────────────────────────────────────┐  │
│  │  🌓  Theme: Dark                   │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  🔔  Notifications: On             │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Connection                              │
│  ┌────────────────────────────────────┐  │
│  │  📱  Desktop Connection            │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  🔄  Auto-Reconnect: On            │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Storage                                 │
│  ┌────────────────────────────────────┐  │
│  │  📊  Usage: 45.3 MB                │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  🗑️  Clear Cache                  │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

## Offline Mode

### Offline Chat Interface

```
┌──────────────────────────────────────────┐
│ 🦝 Atlas Mobile      [User]    ⚙️         │
│ ⚠️ Offline Mode - Limited Features        │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────┐      │
│  │ I'm currently in offline mode. │      │
│  │ I can view our chat history    │      │
│  │ but can't process new requests │      │
│  │ until reconnected.             │      │
│  └────────────────────────────────┘      │
│                                          │
│      ┌─────────────────────────────┐     │
│      │ When will my desktop be     │     │
│      │ available again?            │     │
│      └─────────────────────────────┘     │
│                                          │
│  ┌────────────────────────────────┐      │
│  │ [Previous chat messages        │      │
│  │  available for reference]      │      │
│  └────────────────────────────────┘      │
│                                          │
│                                          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │      Reconnect to Desktop          │  │
│  └────────────────────────────────────┘  │
│                                          │
├──────────────────────────────────────────┤
│  📎 ┌─────────────────────────┐ 🎙️  📷   │
│     │ Message...              │          │
│     └─────────────────────────┘   ▶      │
└──────────────────────────────────────────┘
```

### Reconnection Screen

```
┌──────────────────────────────────────────┐
│                                          │
│               🔄                         │
│                                          │
│         Reconnecting...                  │
│                                          │
│  Looking for previously connected        │
│  desktop devices:                        │
│                                          │
│  • User's PC             Trying...       │
│  • Work Laptop           Waiting...      │
│                                          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │         Scan New QR Code           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │       Continue in Local Mode       │  │
│  └────────────────────────────────────┘  │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

## Media Features

### Camera Analysis Mode

```
┌──────────────────────────────────────────┐
│ ← Back                Live Analysis       │
│                                          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │         [Camera Viewfinder]        │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ I can see a potted plant that      │  │
│  │ appears to be a peace lily         │  │
│  │ (Spathiphyllum). It needs water.   │  │
│  └────────────────────────────────────┘  │
│                                          │
│    📷 Capture     🔄 Refresh Analysis    │
│                                          │
└──────────────────────────────────────────┘
```

### Document Scanner

```
┌──────────────────────────────────────────┐
│ ← Back                Document Scanner    │
│                                          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │         [Camera Viewfinder]        │  │
│  │          with document             │  │
│  │          outline overlay           │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Align document edges with the frame     │
│  for best results                        │
│                                          │
│  ┌────────────────┐ ┌──────────────────┐ │
│  │ 📄 Scan Page   │ │ 🔄 Add More Pages│ │
│  └────────────────┘ └──────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

### OCR Result View

```
┌──────────────────────────────────────────┐
│ ← Back                Scanned Text        │
│                                          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │       [Document Image]             │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Extracted Text:                         │
│  ┌────────────────────────────────────┐  │
│  │ MEETING NOTES                      │  │
│  │ Project: Atlas Mobile              │  │
│  │ Date: June 15, 2023                │  │
│  │                                    │  │
│  │ Action Items:                      │  │
│  │ - Complete UI wireframes           │  │
│  │ - Implement proxy connection       │  │
│  │ - Test media processing            │  │
│  │                                    │  │
│  │ Next meeting: June 22              │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌───────────────┐ ┌───────────────────┐ │
│  │ 📋 Copy Text  │ │ 💬 Send to Chat   │ │
│  └───────────────┘ └───────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

## Responsive Adaptations

### Tablet View (Split Screen)

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🦝 Atlas Mobile                    [User]                        ⚙️     │
│ ◀ Desktop Connection Active                                      📱↔️🖥️ │
├───────────────────────────────┬────────────────────────────────────────┤
│                               │                                         │
│  Chat History                 │  Current Conversation                   │
│                               │                                         │
│  Today                        │  ┌─────────────────────────────────┐    │
│  • Image Analysis (10:30 AM)  │  │ Hi! How can I help you today?   │    │
│  • Document OCR (11:45 AM)    │  └─────────────────────────────────┘    │
│                               │                                         │
│  Yesterday                    │     ┌──────────────────────────────┐    │
│  • Plant Identification       │     │ Can you analyze this image   │    │
│  • Meeting Notes              │     │ of my garden and identify    │    │
│                               │     │ the plants?                  │    │
│  ┌─────────────────────────┐  │     └──────────────────────────────┘    │
│  │ + New Conversation      │  │                                         │
│  └─────────────────────────┘  │  ┌───────────────────────────────────┐  │
│                               │  │ [Image: Garden.jpg]               │  │
│                               │  │                                    │  │
│                               │  │ I can see several plants in your   │  │
│                               │  │ garden image:                      │  │
│                               │  │                                    │  │
│                               │  │ 1. Tomato plants (left side)       │  │
│                               │  │ 2. Basil (center foreground)       │  │
│                               │  │ 3. Rosemary (right corner)         │  │
│                               │  │ 4. What appears to be mint         │  │
│                               │  │    (bottom edge)                   │  │
│                               │  │                                    │  │
│                               │  │ The tomato plants show signs of    │  │
│                               │  │ needing water. The basil looks     │  │
│                               │  │ healthy and ready for harvest.     │  │
│                               │  └───────────────────────────────────┘  │
│                               │                                         │
│                               ├─────────────────────────────────────────┤
│                               │ 📎 ┌─────────────────────┐ 🎙️  📷       │
│                               │    │ Message...          │               │
│                               │    └─────────────────────┘      ▶        │
└───────────────────────────────┴─────────────────────────────────────────┘
```

## Implementation Notes

1. **Responsive Design**
   - Mobile-first approach with adaptations for tablet
   - Accessible touch targets (minimum 44x44 points)
   - Support for system dark/light modes

2. **Connection Features**
   - QR code scanning using device camera
   - Background reconnection attempts when network available
   - Connection status indicators in UI

3. **Media Processing**
   - Camera access for photos, videos, and document scanning
   - Progress indicators for processing on desktop
   - Preview thumbnails of processed media

4. **Offline Capabilities**
   - Chat history viewing when disconnected
   - Queued media processing when reconnected
   - Local file management independent of desktop

5. **Security Features**
   - Encrypted communication with desktop
   - Isolated file systems between devices
   - Automatic session timeouts for security

6. **Accessibility**
   - Voice input for messages
   - Screen reader compatibility
   - Adjustable text sizing
   - High contrast mode support 