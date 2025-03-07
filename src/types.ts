/**
 * Type definitions for A-Frame GIF Shader and Component
 * @see {@link https://aframe.io/docs/1.7.0/core/component.html} A-Frame Component API
 * @see {@link https://threejs.org/docs/#api/en/textures/Texture} Three.js Texture API
 */

import "aframe";
import * as THREE from "three";
import { Material } from "three";

/**
 * Global A-Frame THREE.js type extension
 */
declare global {
  interface Window {
    AFRAME: {
      THREE: typeof THREE;
    };
  }
}

/**
 * GIF frame data structure
 * @see {@link http://www.w3.org/Graphics/GIF/spec-gif89a.txt} GIF89a Specification
 */
export interface GifFrame {
  patch: Uint8ClampedArray;
  dims: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  delay: number;
  disposalType: number;
  transparentIndex?: number;
}

/**
 * Parsed GIF data structure
 */
export interface GifData {
  frames: GifFrame[];
  width: number;
  height: number;
  delays: number[];
  repeat: { x: number; y: number };
}

/**
 * A-Frame property schema type
 * @see {@link https://aframe.io/docs/1.7.0/core/component.html#schema} A-Frame Schema
 */
type PropertySchema = {
  type?: string;
  default?: any;
};

export type Schema<T = any> = {
  [key: string]: PropertySchema;
};

/**
 * GIF shader schema definition
 * @see {@link https://aframe.io/docs/1.7.0/components/material.html#registering-a-custom-shader} Custom Shader
 */
export type GifShaderSchema = Schema<{
  color: { type: string };
  fog: { default: boolean };
  src: { default: null };
  autoplay: { default: boolean };
  opacity: { type: string; default: number };
  alphaTest: { type: string; default: number };
  repeat: { type: string; default: { x: number; y: number } };
  depthTest: { default: boolean };
  depthWrite: { default: boolean };
  transparent: { default: boolean };
}>;

/**
 * Shader data interface for material initialization and updates
 */
export interface ShaderData {
  color?: string;
  fog?: boolean;
  src?: string;
  autoplay?: boolean;
  opacity?: number;
  alphaTest?: number;
  repeat?: { x: number; y: number };
  depthTest?: boolean;
  depthWrite?: boolean;
  transparent?: boolean;
  time?: number;
}

/**
 * Base shader definition interface
 * @see {@link https://aframe.io/docs/1.7.0/components/material.html#registering-a-custom-shader} Custom Shader
 */
export interface BaseShaderDefinition {
  schema: Schema;
  init(data: ShaderData): THREE.Material;
  update?(oldData: ShaderData): void;
  tick?(time: number): void;
}

/**
 * GIF shader implementation interface
 */
export interface GifShaderDefinition {
  el: any;
  material: THREE.Material;
  __cnv: HTMLCanvasElement;
  __ctx: CanvasRenderingContext2D;
  __texture: THREE.Texture;
  __frames: any[] | null;
  __delayTimes: number[] | null;
  __frameIdx: number;
  __frameCnt: number;
  __autoplay: boolean;
  __paused: boolean;
  __textureSrc: string | null;
  __lastTime: number;
  __startTime: number;
  __nextFrameTime: number;
  __offscreenCanvas: HTMLCanvasElement;
  __offscreenCtx: CanvasRenderingContext2D | null;

  init(data: ShaderData): any;
  update(data: ShaderData): void;
  play(): void;
  pause(): void;
  togglePlayback(): void;
  __loadGif(src: string): void;
  __updateTexture(): void;
  __reset(): void;
  __clearCanvas(): void;
}

/**
 * Component data interface
 * @see {@link https://aframe.io/docs/1.7.0/core/component.html#component-data} Component Data
 */
export interface ComponentData {
  src?: string;
  autoplay?: boolean;
  shader?: string;
  repeat?: { x: number; y: number };
  crossOrigin?: string;
}

/**
 * GIF component schema definition
 */
export type GifComponentSchema = Schema<{
  src: { type: string };
  autoplay: { default: boolean };
  shader: { default: string };
  repeat: { type: string; default: { x: number; y: number } };
}>;

/**
 * GIF component implementation interface
 */
export interface GifComponent {
  el: any;
  data: {
    color: string;
    fog: boolean;
    src: string | null;
    autoplay: boolean;
    opacity: number;
    alphaTest: number;
    repeat: { x: number; y: number };
    depthTest: boolean;
    depthWrite: boolean;
    transparent: boolean;
  };
  material: Material;
  __cnv: HTMLCanvasElement;
  __ctx: CanvasRenderingContext2D;
  __texture: THREE.Texture;
  __frameIdx: number;
  __frameCnt: number;
  __delayTimes: number[] | null;
  __frames: any[] | null;
  __autoplay: boolean;
  __paused: boolean;
  __textureSrc: string | null;
  __startTime: number;
  __nextFrameTime: number;
  __offscreenCanvas: HTMLCanvasElement;
  __offscreenCtx: CanvasRenderingContext2D | null;
  __bufferCanvas: HTMLCanvasElement;
  __bufferCtx: CanvasRenderingContext2D;

  init(): void;
  tick(time: number, deltaTime: number): void;
  play(): void;
  pause(): void;
  togglePlayback(): void;
  __loadGif(src: string): void;
  __updateTexture(): void;
  __reset(): void;
  __clearCanvas(): void;
}

/**
 * Material texture loaded event interface
 * @see {@link https://threejs.org/docs/#api/en/textures/Texture} Three.js Texture
 */
export interface MaterialTextureLoadedEvent extends CustomEvent {
  detail: {
    texture: GifTexture;
  };
}

/**
 * Extended Three.js texture interface for GIF support
 * @see {@link https://threejs.org/docs/#api/en/textures/Texture} Three.js Texture
 */
export interface GifTexture extends THREE.Texture {
  isGif: boolean;
  playing: boolean;
  loop: boolean;
  fps: number;
  currentFrame: number;
  totalFrames: number;
  frames: GifFrame[];
  delays: number[];
  delayTimes: number[];
  startTime: number;
  lastFrameTime: number;
  needsUpdate: boolean;

  play(): void;
  pause(): void;
  stop(): void;
  setFrame(frameNumber: number): void;
  update(): void;
}
