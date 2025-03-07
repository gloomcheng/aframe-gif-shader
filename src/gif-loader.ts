/**
 * GIF loading and parsing utilities using gifuct-js
 * @see {@link https://github.com/matt-way/gifuct-js} gifuct-js Documentation
 */

import { parseGIF, decompressFrames, ParsedGif } from "gifuct-js";
import { GifFrame } from "./types";

/**
 * Utility class for loading and parsing GIF files
 */
export class GifLoader {
  /**
   * Parse GIF file buffer into ParsedGif structure
   * @param buffer - Raw GIF file buffer
   * @returns Parsed GIF data structure
   */
  static parseGIF(buffer: ArrayBuffer): ParsedGif {
    return parseGIF(buffer);
  }

  /**
   * Decompress GIF frames from parsed GIF data
   * @param gif - Parsed GIF data
   * @returns Array of decompressed GIF frames
   */
  static decompressFrames(gif: ParsedGif): GifFrame[] {
    return decompressFrames(gif, true) as unknown as GifFrame[];
  }
}
