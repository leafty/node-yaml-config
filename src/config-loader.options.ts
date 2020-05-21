/**
 * config-loader.options.ts
 * ------------------------
 * Options for ConfigLoader
 * Author: Johann-Michael Thiebaut <johann.thiebaut@gmail.com>
 */

/** Options for ConfigLoader */
export interface ConfigLoaderOptions {
  /**
   * Base path to load the configurations from.
   *
   * If not provided, [ConfigLoader] will default to the process working
   * directory.
   */
  basePath?: string;
}
