# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Three.js 3D web application called "Clock Cycle Prototype" that demonstrates an immersive 3D scene with WebXR support. The project is built with Vite and focuses on creating interactive 3D experiences in the browser.

## Development Commands

### Core Commands
- **Start development server**: `npm run dev` (serves on http://localhost:5173)
- **Build for production**: `npm run build` (outputs to `dist/` directory)
- **Preview production build**: `npm run preview`

### Installation
- **Install dependencies**: `npm install`

## Architecture Overview

### Project Structure
- **`src/main.js`**: Main application entry point containing scene setup, rendering loop, and clock cycle animation logic
- **`src/utils/`**: Utility modules for common Three.js operations
  - `loadModel.js`: GLTF model loading helper using Promise-based API
  - `loadTexture.js`: Texture loading helper using Promise-based API
- **`public/assets/`**: Static assets including textures and stylesheets
- **`index.html`**: HTML entry point with XR button container

### Key Architectural Components

#### Scene Architecture
The application follows a standard Three.js pattern:
1. **Scene Setup**: Creates scene, camera (perspective), and WebGL renderer with XR enabled
2. **Lighting**: Ambient + directional lighting with shadow mapping (PCF soft shadows)
3. **Geometry**: Basic cube primitive with material and positioning
4. **Controls**: OrbitControls for camera interaction (zoom, pan, orbit)
5. **Floor**: Textured plane using concrete texture with tiling

#### Clock Cycle System
The core feature is a pulsing animation system controlled by:
- `pulseHz`: Pulse frequency (default 1.6 Hz)
- `base`: Baseline scale (1.0)
- `amp`: Amplitude of scale variation (0.18)
- Global function `setPulseHz()` exposed to browser console for runtime adjustment

#### WebXR Integration
- WebXR enabled on renderer (`renderer.xr.enabled = true`)
- VR button automatically added to DOM in designated container
- XR button positioned via CSS in top-right corner

### Build System
- **Vite**: Fast development server and build tool
- **Base path**: Configured for GitHub Pages deployment (`base: './'`)
- **ES Modules**: Project uses ES6 module syntax (`"type": "module"`)

### Deployment
Automated CI/CD via GitHub Actions:
- **CI**: Tests build on Node 18.x and 20.x for every push/PR to main
- **Deployment**: Auto-deploys to GitHub Pages (`gh-pages` branch) on main branch pushes
- **Build artifacts**: `dist/` directory deployed to GitHub Pages

## Development Guidelines

### Working with 3D Assets
- Textures stored in `public/assets/` with organized subdirectories
- Use the `loadTexture()` utility for consistent texture loading with error handling
- Use the `loadGLTFModel()` utility for 3D model imports
- Textures should be configured with appropriate wrapping and repeat settings

### Scene Modifications
- Main scene setup happens in `src/main.js`
- Camera positioned at `(2, 2, 5)` looking at origin
- Grid helper provides spatial reference (20x20 units, 20 divisions)
- Shadow casting/receiving properly configured for depth perception

### Animation System
- Animation loop uses `requestAnimationFrame` for smooth 60fps rendering
- OrbitControls require `controls.update()` in render loop
- Clock cycle timing based on `performance.now()` for precision

### Styling and UI
- Minimal CSS focused on full-screen immersive experience
- Body: no margin, hidden overflow
- XR button positioned fixed in top-right corner
- Canvas styled as block element

### Testing Locally
- Development server auto-reloads on file changes
- Visit http://localhost:5173 to view the scene
- Use browser console to call `setPulseHz(value)` for runtime pulse adjustment
- Test WebXR features with compatible VR devices/browsers

### Asset Management
- Static assets served from `public/` directory
- Texture files organized in descriptive subdirectories
- CSS served from `public/assets/styles/`
- All assets referenced with absolute paths from root