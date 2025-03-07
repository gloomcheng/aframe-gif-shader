/**
 * A-Frame GIF Shader Implementation
 * Custom shader for rendering animated GIFs in A-Frame
 * @see {@link https://aframe.io/docs/1.7.0/components/material.html#registering-a-custom-shader} Custom Shader
 * @see {@link https://threejs.org/docs/#api/en/materials/ShaderMaterial} Three.js ShaderMaterial
 */

import { GifComponent } from "./types";
import { GifLoader } from "./gif-loader";
import { resolveUrl } from "./utils";

/**
 * Registers the GIF shader with A-Frame
 */
export function registerGifShader() {
  const THREE = window.AFRAME.THREE;

  window.AFRAME.registerComponent("gif-shader", {
    /**
     * Shader property schema
     * @see {@link https://aframe.io/docs/1.7.0/core/component.html#schema} Schema Documentation
     */
    schema: {
      color: { type: "color" },
      fog: { default: true },
      src: { default: null },
      autoplay: { default: true },
      opacity: { type: "number", default: 1.0 },
      alphaTest: { type: "number", default: 0.0 },
      repeat: { type: "vec2", default: { x: 1, y: 1 } },
      depthTest: { default: true },
      depthWrite: { default: true },
      transparent: { default: true },
    },

    /**
     * Initialize shader component
     * Sets up canvases, textures, and material
     */
    init: function (this: GifComponent) {
      // Initialize main canvas and context
      this.__cnv = document.createElement("canvas");
      this.__cnv.width = 2;
      this.__cnv.height = 2;
      this.__ctx = this.__cnv.getContext("2d", { willReadFrequently: true })!;
      this.__texture = new THREE.Texture(this.__cnv);

      // Configure texture parameters
      this.__texture.minFilter = THREE.LinearFilter;
      this.__texture.magFilter = THREE.LinearFilter;
      this.__texture.generateMipmaps = false;
      this.__texture.colorSpace = THREE.SRGBColorSpace;
      this.__texture.wrapS = THREE.RepeatWrapping;
      this.__texture.wrapT = THREE.RepeatWrapping;
      this.__texture.premultiplyAlpha = true;
      this.__texture.flipY = true;
      this.__texture.format = THREE.RGBAFormat;

      // Initialize animation state
      this.__frameIdx = 0;
      this.__frameCnt = 0;
      this.__delayTimes = null;
      this.__frames = null;
      this.__autoplay = this.data.autoplay !== false;
      this.__paused = !this.__autoplay;
      this.__textureSrc = null;
      this.__startTime = 0;
      this.__nextFrameTime = 0;

      // Create offscreen canvas for frame composition
      this.__offscreenCanvas = document.createElement("canvas");
      this.__offscreenCanvas.width = 2;
      this.__offscreenCanvas.height = 2;
      this.__offscreenCtx = this.__offscreenCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      // Create Three.js material
      this.material = new THREE.MeshBasicMaterial({
        map: this.__texture,
        transparent: true,
        side: THREE.DoubleSide,
        fog: this.data.fog,
        opacity: 1.0,
        alphaTest: this.data.alphaTest,
        depthTest: this.data.depthTest,
        depthWrite: this.data.depthWrite,
        color: new THREE.Color(this.data.color),
      });

      // Set texture repeat if specified
      if (this.data.repeat) {
        this.__texture.repeat.set(this.data.repeat.x, this.data.repeat.y);
      }

      /**
       * Apply material to entity's mesh
       */
      const applyMaterial = () => {
        const mesh = this.el.getObject3D("mesh");
        if (mesh) {
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(() => this.material);
          } else {
            mesh.material = this.material;
          }
        }
      };

      // Apply material and load GIF when entity is ready
      if (this.el.hasLoaded) {
        applyMaterial();
        if (this.data.src) {
          this.__loadGif(this.data.src);
        }
      } else {
        this.el.addEventListener("loaded", () => {
          applyMaterial();
          if (this.data.src) {
            this.__loadGif(this.data.src);
          }
        });
      }
    },

    /**
     * Frame update handler
     * Manages GIF animation timing and frame updates
     */
    tick: function (this: GifComponent, time: number, deltaTime: number) {
      if (!this.__frames || !this.__delayTimes || this.__paused) return;

      // Initialize start time on first update
      if (this.__startTime === 0) {
        this.__startTime = time;
        this.__nextFrameTime = time + this.__delayTimes[0];
        return;
      }

      // Update frame at fixed intervals
      if (time >= this.__nextFrameTime) {
        this.__frameIdx = (this.__frameIdx + 1) % this.__frameCnt;
        this.__nextFrameTime += this.__delayTimes[0];

        // Reset timer if significantly behind
        if (time - this.__nextFrameTime > 1000) {
          this.__nextFrameTime = time + this.__delayTimes[0];
        }

        this.__updateTexture();
      }
    },

    /**
     * Loads and processes a GIF file
     * @param src - URL or selector for GIF image
     */
    __loadGif: function (this: GifComponent, src: string) {
      let url = src;

      // Extract filename from URL
      const fileName = url.split("/").pop() || url;

      // Handle asset references
      if (src.startsWith("#")) {
        const asset = document.querySelector(src) as HTMLImageElement;
        if (asset && asset.src) {
          url = asset.src;
        } else {
          console.error("Asset not found:", src);
          return;
        }
      }

      url = resolveUrl(url);
      if (!url) {
        console.error("Invalid GIF URL:", src);
        return;
      }

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.arrayBuffer();
        })
        .then((buffer) => {
          const parsedGif = GifLoader.parseGIF(buffer);
          const frames = GifLoader.decompressFrames(parsedGif);

          // Analyze GIF timing characteristics
          const delays = frames.map((f) => f.delay);
          const avgDelay = delays.reduce((a, b) => a + b, 0) / delays.length;
          const normalizedDelays = new Array(delays.length).fill(avgDelay);

          // Set canvas dimensions to first frame size
          const firstFrame = frames[0];
          this.__cnv.width = firstFrame.dims.width;
          this.__cnv.height = firstFrame.dims.height;
          this.__offscreenCanvas.width = firstFrame.dims.width;
          this.__offscreenCanvas.height = firstFrame.dims.height;

          // Reapply repeat settings
          if (this.data.repeat) {
            this.__texture.repeat.set(this.data.repeat.x, this.data.repeat.y);
          }

          this.__frames = frames;
          this.__delayTimes = normalizedDelays;
          this.__frameCnt = frames.length;
          this.__frameIdx = 0;
          this.__textureSrc = src;

          // Update first frame immediately
          this.__updateTexture();

          if (this.__autoplay) {
            this.play();
          }
        })
        .catch((error) => {
          console.error("Failed to load GIF:", error);
          this.__reset();
        });
    },

    /**
     * Updates texture with current frame data
     * Handles frame disposal methods according to GIF spec
     * @see {@link http://www.w3.org/Graphics/GIF/spec-gif89a.txt} GIF89a Specification
     */
    __updateTexture: function (this: GifComponent) {
      if (!this.__frames || !this.__ctx || !this.__offscreenCtx) return;

      const frame = this.__frames[this.__frameIdx];
      if (!frame) return;

      try {
        // Create temporary canvas for current frame
        const frameCanvas = document.createElement("canvas");
        frameCanvas.width = frame.dims.width;
        frameCanvas.height = frame.dims.height;
        const frameCtx = frameCanvas.getContext("2d", {
          willReadFrequently: true,
          alpha: true,
        });

        if (!frameCtx) return;

        // Draw current frame to frame canvas
        const imageData = new ImageData(
          frame.patch,
          frame.dims.width,
          frame.dims.height
        );
        frameCtx.putImageData(imageData, 0, 0);

        // Handle frame disposal method
        if (frame.disposalType === 2 || this.__frameIdx === 0) {
          // Clear area for disposal method 2 or first frame
          this.__ctx.clearRect(
            frame.dims.left - 1,
            frame.dims.top - 1,
            frame.dims.width + 2,
            frame.dims.height + 2
          );
        } else {
          // Restore content from offscreen canvas for other disposal methods
          this.__ctx.globalCompositeOperation = "copy";
          this.__ctx.drawImage(this.__offscreenCanvas, 0, 0);
          this.__ctx.globalCompositeOperation = "source-over";
        }

        // Draw current frame to main canvas
        this.__ctx.drawImage(
          frameCanvas,
          0,
          0,
          frame.dims.width,
          frame.dims.height,
          frame.dims.left,
          frame.dims.top,
          frame.dims.width,
          frame.dims.height
        );

        // Update offscreen canvas
        this.__offscreenCtx.clearRect(
          0,
          0,
          this.__offscreenCanvas.width,
          this.__offscreenCanvas.height
        );
        this.__offscreenCtx.drawImage(this.__cnv, 0, 0);

        // Mark texture for update
        this.__texture.needsUpdate = true;
      } catch (error) {
        console.error("Error updating frame:", error);
      }
    },

    /**
     * Resets component state
     */
    __reset: function (this: GifComponent) {
      this.__frames = null;
      this.__delayTimes = null;
      this.__frameCnt = 0;
      this.__frameIdx = 0;
      this.__textureSrc = null;
      this.__startTime = 0;
      this.__nextFrameTime = 0;
    },

    /**
     * Clears all canvases
     */
    __clearCanvas: function (this: GifComponent) {
      if (this.__ctx) {
        this.__ctx.clearRect(0, 0, this.__cnv.width, this.__cnv.height);
      }
      if (this.__offscreenCtx) {
        this.__offscreenCtx.clearRect(
          0,
          0,
          this.__offscreenCanvas.width,
          this.__offscreenCanvas.height
        );
      }
      if (this.__texture) {
        this.__texture.needsUpdate = true;
      }
    },

    /**
     * Starts GIF animation playback
     */
    play: function (this: GifComponent) {
      this.__paused = false;
      this.__startTime = 0;
    },

    /**
     * Pauses GIF animation playback
     */
    pause: function (this: GifComponent) {
      this.__paused = true;
    },

    /**
     * Toggles GIF animation playback state
     */
    togglePlayback: function (this: GifComponent) {
      if (this.__paused) {
        this.play();
      } else {
        this.pause();
      }
    },
  });
}
