/**
 * GIF Texture implementation for Three.js
 * Extends Three.js Texture to support animated GIFs
 * @see {@link https://threejs.org/docs/#api/en/textures/Texture} Three.js Texture
 */

import { GifFrame, GifTexture } from "./types";

/**
 * Factory class for creating GIF textures
 */
export class GifTextureCreator {
  /**
   * Creates a new GIF texture with animation support
   * @param frames - Array of decoded GIF frames
   * @param delays - Array of frame delay times
   * @param options - Configuration options for the texture
   * @returns GIF-enabled Three.js texture
   */
  static create(
    frames: GifFrame[],
    delays: number[],
    options: { autoplay?: boolean; repeat?: { x: number; y: number } } = {}
  ): GifTexture {
    const THREE = window.AFRAME.THREE;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Set canvas dimensions based on first frame
    if (frames.length > 0) {
      const firstFrame = frames[0];
      canvas.width = firstFrame.dims.width;
      canvas.height = firstFrame.dims.height;
    }

    // Create base texture with optimal settings
    const texture = new THREE.Texture(canvas) as GifTexture;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    // Configure texture wrapping for repeat option
    if (options.repeat) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(options.repeat.x, options.repeat.y);
    }

    // Initialize GIF-specific properties
    texture.isGif = true;
    texture.playing = options.autoplay !== false;
    texture.loop = true;
    texture.fps = 0;
    texture.currentFrame = 0;
    texture.totalFrames = frames.length;
    texture.frames = frames;
    texture.delays = delays;
    texture.delayTimes = delays;
    texture.startTime = -1;
    texture.lastFrameTime = -1;

    // Animation control methods
    texture.play = function () {
      this.playing = true;
      this.startTime = -1;
      this.lastFrameTime = -1;
    };

    texture.pause = function () {
      this.playing = false;
    };

    texture.stop = function () {
      this.playing = false;
      this.currentFrame = 0;
      this.startTime = -1;
      this.lastFrameTime = -1;
      this.update();
    };

    texture.setFrame = function (frameNumber: number) {
      if (frameNumber >= 0 && frameNumber < this.totalFrames) {
        this.currentFrame = frameNumber;
        this.update();
      }
    };

    /**
     * Updates the texture with the current frame data
     * Uses a canvas to render the frame and triggers texture update
     */
    texture.update = function () {
      if (!this.frames || this.frames.length === 0) return;

      const frame = this.frames[this.currentFrame];
      if (!frame) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        // Create ImageData from frame patch
        const imageData = new ImageData(
          frame.patch,
          frame.dims.width,
          frame.dims.height
        );

        // Render frame with correct positioning
        ctx.putImageData(
          imageData,
          frame.dims.left,
          frame.dims.top,
          0,
          0,
          frame.dims.width,
          frame.dims.height
        );

        this.needsUpdate = true;
      } catch (error) {
        console.error("Error updating frame:", error);
      }
    };

    // Initialize first frame
    texture.update();

    // Start animation if autoplay is enabled
    if (options.autoplay !== false) {
      texture.play();
    }

    return texture;
  }
}
