/**
 * Utility functions for A-Frame GIF Shader
 */

/**
 * Resolves various types of URLs and selectors to their final URL form
 * Handles:
 * - DOM element selectors (e.g., #gifImage)
 * - url() CSS function syntax
 * - Relative paths
 * - Absolute URLs
 *
 * @param src - Source URL or selector
 * @returns Resolved URL string
 */
export function resolveUrl(src: string): string {
  if (!src) return "";

  // Check if it's a selector (e.g., #gifImage)
  if (src.startsWith("#")) {
    const el = document.querySelector(src);
    if (el) {
      if (el instanceof HTMLImageElement && el.src) {
        return el.src;
      } else if (el instanceof HTMLCanvasElement) {
        return el.toDataURL();
      } else if (el.getAttribute("src")) {
        return el.getAttribute("src") || "";
      }
    }
  }

  // Handle url() CSS function syntax
  if (src.startsWith("url(") && src.endsWith(")")) {
    src = src.slice(4, -1).replace(/['"]/g, "");
  }

  // Convert relative paths to absolute
  if (
    !src.startsWith("http://") &&
    !src.startsWith("https://") &&
    !src.startsWith("data:")
  ) {
    const basePath = window.location.pathname.substring(
      0,
      window.location.pathname.lastIndexOf("/") + 1
    );
    src = basePath + src;
  }

  return src;
}

/**
 * Patches Three.js WebGLRenderer to handle useLegacyLights deprecation warning
 * This is needed for compatibility with different versions of Three.js used by A-Frame
 *
 * @see {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer} Three.js WebGLRenderer
 */
export function patchWebGLRenderer() {
  if (!window.AFRAME) return;

  const THREE = window.AFRAME.THREE;
  const originalWebGLRenderer = THREE.WebGLRenderer;

  if ((originalWebGLRenderer as any).__patched) return;

  THREE.WebGLRenderer = function (parameters?: { [key: string]: any }) {
    const renderer = new originalWebGLRenderer(parameters);

    Object.defineProperty(renderer, "useLegacyLights", {
      get: () => false,
      set: () => {
        // Silently ignore the deprecation
      },
    });

    return renderer;
  } as any;

  THREE.WebGLRenderer.prototype = originalWebGLRenderer.prototype;
  Object.setPrototypeOf(THREE.WebGLRenderer, originalWebGLRenderer);
  (THREE.WebGLRenderer as any).__patched = true;
}
