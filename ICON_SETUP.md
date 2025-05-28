# Icon Setup Guide for TanukiMCP Atlas

## Current Assets

The project includes these icon assets in the `/assets` directory:
- `TanukiMCPLogo.png` - Main logo (PNG format)
- `TanukiMCPFavicon.png` - Favicon version
- `favicon.ico` - ICO format favicon

## Required Icon Formats

For professional desktop distribution, you need platform-specific icon formats:

### Windows
- `.ico` file with multiple sizes (16x16, 32x32, 48x48, 256x256)
- Recommended: 512x512 source for best quality

### macOS
- `.icns` file with multiple sizes
- Recommended: 1024x1024 source for Retina displays

### Linux
- `.png` files in various sizes
- Standard sizes: 16, 32, 48, 64, 128, 256, 512

## Icon Generation Tools

### Online Tools (Recommended for Quick Setup)
1. **ICO Convert** (https://icoconvert.com/)
   - Upload PNG → Download ICO with multiple sizes
   - Free and easy to use

2. **CloudConvert** (https://cloudconvert.com/)
   - Supports PNG to ICNS conversion
   - Batch processing available

### Command Line Tools
1. **ImageMagick** (Cross-platform)
   ```bash
   # Install ImageMagick
   # Windows: choco install imagemagick
   # macOS: brew install imagemagick
   # Linux: sudo apt install imagemagick
   
   # Generate ICO file
   magick TanukiMCPLogo.png -resize 256x256 -define icon:auto-resize=256,128,64,48,32,16 icon.ico
   
   # Generate ICNS file (macOS)
   magick TanukiMCPLogo.png -resize 1024x1024 icon.icns
   ```

2. **png2icons** (Node.js package)
   ```bash
   npm install -g png2icons
   png2icons assets/TanukiMCPLogo.png assets/
   ```

## Recommended Icon Structure

Create this directory structure:
```
assets/
├── icons/
│   ├── icon.ico          # Windows icon (multi-size)
│   ├── icon.icns         # macOS icon
│   ├── icon.png          # Linux icon (512x512)
│   ├── icon-16.png       # 16x16
│   ├── icon-32.png       # 32x32
│   ├── icon-48.png       # 48x48
│   ├── icon-64.png       # 64x64
│   ├── icon-128.png      # 128x128
│   └── icon-256.png      # 256x256
├── TanukiMCPLogo.png     # Source logo
├── TanukiMCPFavicon.png  # Favicon
└── favicon.ico           # ICO favicon
```

## Quick Setup Instructions

1. **Generate Windows ICO file:**
   - Go to https://icoconvert.com/
   - Upload `assets/TanukiMCPLogo.png`
   - Select sizes: 16, 32, 48, 64, 128, 256
   - Download as `assets/icons/icon.ico`

2. **Generate macOS ICNS file:**
   - Use CloudConvert or ImageMagick
   - Convert PNG to ICNS format
   - Save as `assets/icons/icon.icns`

3. **Generate Linux PNG icons:**
   - Resize the logo to different sizes
   - Save as `assets/icons/icon-{size}.png`

## Update package.json Configuration

After generating icons, update your `package.json`:

```json
{
  "build": {
    "appId": "com.tanukimcp.atlas",
    "productName": "TanukiMCP Atlas",
    "directories": {
      "output": "dist"
    },
    "files": [
      "packages/renderer/dist/**/*",
      "packages/main/dist/**/*",
      "packages/preload/dist/**/*"
    ],
    "win": {
      "icon": "assets/icons/icon.ico",
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        },
        {
          "target": "msi",
          "arch": ["x64"]
        }
      ]
    },
    "mac": {
      "icon": "assets/icons/icon.icns",
      "category": "public.app-category.developer-tools",
      "target": [
        {
          "target": "dmg",
          "arch": ["x64", "arm64"]
        }
      ]
    },
    "linux": {
      "icon": "assets/icons/",
      "target": [
        {
          "target": "AppImage",
          "arch": ["x64"]
        },
        {
          "target": "deb",
          "arch": ["x64"]
        }
      ]
    }
  }
}
```

## Automated Icon Generation Script

Create `scripts/generate-icons.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 64, 128, 256, 512];
const sourceIcon = 'assets/TanukiMCPLogo.png';
const outputDir = 'assets/icons';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate PNG icons for different sizes
sizes.forEach(size => {
  sharp(sourceIcon)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon-${size}.png`))
    .then(() => console.log(`Generated icon-${size}.png`))
    .catch(err => console.error(`Error generating icon-${size}.png:`, err));
});

// Generate main icon for Linux
sharp(sourceIcon)
  .resize(512, 512)
  .png()
  .toFile(path.join(outputDir, 'icon.png'))
  .then(() => console.log('Generated icon.png'))
  .catch(err => console.error('Error generating icon.png:', err));
```

Add to package.json scripts:
```json
{
  "scripts": {
    "generate-icons": "node scripts/generate-icons.js"
  }
}
```

## Testing Icons

After setup, test your icons:

1. **Build locally:**
   ```bash
   npm run build
   npm run dist
   ```

2. **Check generated installers:**
   - Windows: Look for proper icon in .exe/.msi
   - macOS: Check .dmg and .app bundle
   - Linux: Verify .AppImage and .deb packages

3. **Install and verify:**
   - Install the application
   - Check desktop shortcuts
   - Verify system tray icon
   - Test taskbar/dock appearance

## Troubleshooting

### Common Issues

1. **Icon not showing in build:**
   - Check file paths in package.json
   - Ensure icon files exist
   - Verify file permissions

2. **Low quality icons:**
   - Use higher resolution source (1024x1024+)
   - Generate proper multi-size ICO files
   - Use PNG for better quality

3. **macOS icon issues:**
   - Ensure ICNS file has multiple sizes
   - Check Apple's icon guidelines
   - Test on different macOS versions

### Icon Guidelines

- **Windows**: Use ICO format with multiple sizes
- **macOS**: Use ICNS format, follow Apple HIG
- **Linux**: Use PNG format, follow freedesktop.org standards
- **Source**: Keep high-resolution source (1024x1024 minimum)
- **Design**: Ensure icon works at small sizes (16x16)

## Next Steps

1. Generate all required icon formats
2. Update package.json configuration
3. Test builds locally
4. Commit icon files to repository
5. Test GitHub Actions workflow