/**
 * A-Frame GIF Component
 * Provides a high-level interface for displaying animated GIFs in A-Frame
 * @see {@link https://aframe.io/docs/1.7.0/core/component.html} A-Frame Component API
 */

import { ComponentData } from "./types";

/**
 * Registers the GIF component with A-Frame
 * The component wraps the gif-shader for easier use
 */
export function registerGifComponent() {
  window.AFRAME.registerComponent("gif", {
    /**
     * Component schema definition
     * @see {@link https://aframe.io/docs/1.7.0/core/component.html#schema} Schema Documentation
     */
    schema: {
      src: { type: "string" },
      autoplay: { default: true },
      shader: { default: "gif" },
      repeat: { type: "vec2", default: { x: 1, y: 1 } },
    },

    /**
     * Component initialization
     * Sets up the gif-shader with initial properties
     */
    init() {
      // Initialize gif-shader component
      this.el.setAttribute("gif-shader", {
        src: this.data.src,
        autoplay: this.data.autoplay,
        repeat: this.data.repeat,
      });
    },

    /**
     * Component update handler
     * Updates gif-shader properties when component properties change
     * @param oldData - Previous component data
     */
    update(oldData: ComponentData = {}) {
      const data = this.data;

      // Update gif-shader component properties
      if (data.src !== oldData.src) {
        this.el.setAttribute("gif-shader", "src", data.src);
      }

      if (data.autoplay !== oldData.autoplay) {
        this.el.setAttribute("gif-shader", "autoplay", data.autoplay);
      }

      if (
        data.repeat &&
        (oldData.repeat?.x !== data.repeat.x ||
          oldData.repeat?.y !== data.repeat.y)
      ) {
        this.el.setAttribute("gif-shader", "repeat", data.repeat);
      }
    },

    /**
     * Component cleanup
     * Removes the gif-shader when component is removed
     */
    remove() {
      this.el.removeAttribute("gif-shader");
    },

    /**
     * Starts GIF animation playback
     */
    play() {
      const shader = this.el.components["gif-shader"];
      if (shader) {
        shader.play();
      }
    },

    /**
     * Pauses GIF animation playback
     */
    pause() {
      const shader = this.el.components["gif-shader"];
      if (shader) {
        shader.pause();
      }
    },

    /**
     * Frame update handler
     * Delegates animation updates to the gif-shader
     * @param time - Current time in milliseconds
     * @param timeDelta - Time since last frame in milliseconds
     */
    tick(time: number, timeDelta: number) {
      const shader = this.el.components["gif-shader"];
      if (shader && typeof shader.tick === "function") {
        shader.tick(time, timeDelta);
      }
    },
  });
}
