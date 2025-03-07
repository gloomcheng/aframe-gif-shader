/**
 * A-Frame GIF Shader and Component
 *
 * A TypeScript implementation for displaying animated GIFs in A-Frame scenes.
 * Combines both shader and component functionalities in a single package.
 *
 * @see {@link https://aframe.io/docs/1.7.0/introduction/} A-Frame Documentation
 * @version 1.0.0
 * @license MIT
 */

import { registerGifComponent } from "./component";
import { registerGifShader } from "./shader";
import { patchWebGLRenderer } from "./utils";

/**
 * Interface for GIF data storage and management
 */
interface GifDataEntry {
  status: string;
  src: string;
  times: number[];
  cnt: number;
  frames: HTMLImageElement[];
  timestamp: number;
  callbacks: ((data: any) => void)[];
}

// Initialize WebGL renderer with required patches
patchWebGLRenderer();

// Register A-Frame components
registerGifShader();
registerGifComponent();
