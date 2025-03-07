# A-Frame GIF Shader

A TypeScript rewrite that combines [mayognaise/aframe-gif-shader](https://github.com/mayognaise/aframe-gif-shader) and [mayognaise/aframe-gif-component](https://github.com/mayognaise/aframe-gif-component) with extended A-Frame version support (1.3.0 to 1.7.0). The original shader was inspired by [@gtk2k's sample](https://github.com/gtk2k/gtk2k.github.io/tree/master/animation_gif), and this version integrates both the shader and component functionalities into a single package. We use [gifuct-js](https://github.com/matt-way/gifuct-js) for efficient GIF decoding and add comprehensive TypeScript support.

English | [繁體中文](README.zh-TW.md)

## Features

- Combined shader and component functionality in one package
- TypeScript support with type definitions
- Extended A-Frame version compatibility (1.3.0 to 1.7.0)
- Display animated GIFs in A-Frame scenes with efficient decoding
- Animation control (play, pause, toggle playback)
- Full compatibility with A-Frame's material system
- Optimized rendering performance using gifuct-js
- Support for transparency and color adjustment
- Frame-by-frame GIF control
- Proper disposal method handling
- Transparent GIF support

## Installation

### CDN Installation (Recommended)

```html
<script src="https://aframe.io/releases/1.7.0/aframe.min.js"></script>
<!-- Using jsDelivr CDN (Recommended) -->
<script src="https://cdn.jsdelivr.net/gh/gloomcheng/aframe-gif-shader@latest/dist/aframe-gif-shader.min.js"></script>

<!-- Or using raw GitHub (Not recommended for production) -->
<script src="https://raw.githubusercontent.com/gloomcheng/aframe-gif-shader/main/dist/aframe-gif-shader.min.js"></script>
```

### Local Installation

1. Clone the repository:

```bash
git clone https://github.com/gloomcheng/aframe-gif-shader.git
```

2. Install dependencies and build:

```bash
cd aframe-gif-shader
npm install
npm run build
```

3. Include in your project:

```html
<script src="path/to/aframe-gif-shader/dist/aframe-gif-shader.min.js"></script>
```

Note: This package is not available on npm as the original package name is already registered.

## Basic Usage

### Using GIF Component (Recommended)

```html
<a-entity
  gif="
  src: url(animation.gif);
  autoplay: true;
  repeat: 1 1;
"
></a-entity>
```

### Using GIF Shader

```html
<a-entity
  gif-shader="
  src: url(animation.gif);
  autoplay: true;
  repeat: 1 1;
  opacity: 1.0;
  transparent: true;
"
></a-entity>
```

## Component Properties

### GIF Component Properties

| Property | Description                   | Default |
| -------- | ----------------------------- | ------- |
| src      | URL or selector for GIF image | null    |
| autoplay | Whether to autoplay animation | true    |
| repeat   | Texture repeat (x, y)         | 1 1     |

### GIF Shader Properties

| Property    | Description                      | Default |
| ----------- | -------------------------------- | ------- |
| src         | URL or selector for GIF image    | null    |
| autoplay    | Whether to autoplay animation    | true    |
| color       | Base color                       | none    |
| fog         | Whether affected by fog          | true    |
| opacity     | Opacity value                    | 1.0     |
| alphaTest   | Alpha test threshold             | 0.0     |
| repeat      | Texture repeat (x, y)            | 1 1     |
| depthTest   | Whether to perform depth testing | true    |
| depthWrite  | Whether to write to depth buffer | true    |
| transparent | Whether to enable transparency   | true    |

## Methods

### GIF Component Methods

```javascript
const entity = document.querySelector("[gif]");

// Play animation
entity.components.gif.play();

// Pause animation
entity.components.gif.pause();
```

### GIF Shader Methods

```javascript
const entity = document.querySelector("[gif-shader]");

// Play animation
entity.components["gif-shader"].play();

// Pause animation
entity.components["gif-shader"].pause();

// Toggle playback state
entity.components["gif-shader"].togglePlayback();
```

## Examples

### Basic Animation

```html
<a-scene>
  <a-assets>
    <img id="gif-texture" src="animation.gif" />
  </a-assets>

  <!-- Using GIF Component -->
  <a-box position="-1 1 -3" gif="src: #gif-texture"></a-box>

  <!-- Using GIF Shader -->
  <a-sphere
    position="1 1 -3"
    gif-shader="
    src: url(animation.gif);
    color: #FFF;
    opacity: 0.9;
  "
  ></a-sphere>
</a-scene>
```

### Controlling Animation

```html
<a-scene>
  <a-box
    id="animated-box"
    position="0 1.5 -3"
    gif="src: url(animation.gif); autoplay: false;"
  >
  </a-box>

  <script>
    // Play animation on click
    document
      .querySelector("#animated-box")
      .addEventListener("click", function () {
        this.components.gif.play();
      });
  </script>
</a-scene>
```

## Browser Support

- Chrome (Desktop & Android)
- Firefox (Desktop & Android)
- Safari (macOS & iOS)

## Known Issues

- **Rendering Artifacts**: Some GIF animations may exhibit ghosting or visual artifacts of the image. This is a known limitation of the current rendering implementation, particularly noticeable with GIFs that have complex transparency or disposal methods.
- **Performance with Large GIFs**: Large GIF files (high resolution or many frames) may impact performance due to the current frame-by-frame rendering approach.

We are actively working on these issues. If you encounter these problems, you can try the following workarounds:

- Use smaller GIF files
- Reduce the number of animated GIFs in a scene
- Position elements to minimize the visibility of right-side artifacts

## Development

```bash
git clone https://github.com/gloomcheng/aframe-gif-shader.git
cd aframe-gif-shader
npm install
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [mayognaise/aframe-gif-shader](https://github.com/mayognaise/aframe-gif-shader) - Original shader implementation
- [A-Frame](https://aframe.io) - The WebXR Framework
- [@gtk2k](https://github.com/gtk2k) - Original GIF animation implementation reference
- [gifuct-js](https://github.com/matt-way/gifuct-js) - Fast and efficient GIF decoder
- [Matt Way & Nick Drewe](https://github.com/matt-way) - Authors of gifuct-js
