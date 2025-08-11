# Icon Generation Instructions

## Current Status
- ✅ Placeholder icons generated
- ✅ SVG templates created
- ⚠️ Production icons needed

## Next Steps

### 1. Design Production Icons
Use the SVG templates in assets/ as starting points:
- Edit with design tools (Figma, Sketch, Adobe Illustrator)
- Maintain the vehicle tracking theme
- Use brand colors: #2563eb (primary), #1e40af (secondary)

### 2. Convert SVG to PNG
Use online tools or command line:

**Online conversion:**
- svg2png.com
- convertio.co
- cloudconvert.com

**Command line (ImageMagick):**
```bash
magick convert icon.svg -resize 1024x1024 icon.png
```

**Command line (Inkscape):**
```bash
inkscape icon.svg -w 1024 -h 1024 -o icon.png
```

### 3. Replace Placeholders
Replace the generated PNG files with your designed icons while maintaining the same filenames.

### 4. App Store Requirements
- iOS: 1024x1024 px icon required for App Store
- Android: 512x512 px icon required for Google Play
- All icons should be PNG format
- No transparency for main app icon

### 5. Testing
Test icons across different devices and OS versions to ensure visibility and quality.
