/**
 * config-loader.ts
 * ----------------
 * ConfigLoader is the class used to load yaml config files
 * Author: Johann-Michael Thiebaut <johann.thiebaut@gmail.com>
 */

import { readFile as readFileLegacy, readFileSync } from 'fs';
import { load } from 'js-yaml';
import * as extend from 'node.extend';
import { resolve } from 'path';
import { promisify } from 'util';
import { ConfigLoaderOptions } from './config-loader.options';

const readFile = promisify(readFileLegacy);

/** Loads configuration from yaml files */
export class ConfigLoader {
  private readonly loadedFiles: Record<string, any> = {};

  constructor(private readonly options?: ConfigLoaderOptions) {}

  /**
   * Reads a yaml file
   */
  read(filename: string): any {
    const path = this.getPath(filename);
    const data = load(readFileSync(path, { encoding: 'utf-8' }));
    this.loadedFiles[path] = data;
    return data;
  }

  /**
   * Loads a yaml configuration
   * If the file has already been parsed, the file is not read again.
   */
  load(filename: string, env?: string): any {
    const path = this.getPath(filename);
    let data: any;

    if (this.loadedFiles.hasOwnProperty(path)) {
      data = this.loadedFiles[path];
    } else {
      data = this.read(filename);
    }

    const _env = env || process.env.NODE_ENV || 'development';
    const defaultConfig = data.default || {};
    const extensionConfig = data[_env] || {};

    return extend(true, extend(true, {}, defaultConfig), extensionConfig);
  }

  /**
   * Reloads a yaml configuration from disk
   * If the file has already been parsed, the file is not read again.
   */
  reload(filename: string, env?: string): any {
    this.read(filename);
    return this.load(filename, env);
  }

  /**
   * Reads a yaml file (async variant)
   */
  async readAsync(filename: string): Promise<any> {
    const path = this.getPath(filename);
    const data = load(await readFile(path, { encoding: 'utf-8' }));
    this.loadedFiles[path] = data;
    return data;
  }

  /**
   * Loads a yaml configuration (async variant)
   * If the file has already been parsed, the file is not read again.
   */
  async loadAsync(filename: string, env?: string): Promise<any> {
    const path = this.getPath(filename);
    let data: any;

    if (this.loadedFiles.hasOwnProperty(path)) {
      data = this.loadedFiles[path];
    } else {
      data = await this.readAsync(filename);
    }

    const _env = env || process.env.NODE_ENV || 'development';
    const defaultConfig = data.default || {};
    const extensionConfig = data[_env] || {};

    return extend(true, extend(true, {}, defaultConfig), extensionConfig);
  }

  /**
   * Reloads a yaml configuration from disk (async variant)
   * If the file has already been parsed, the file is not read again.
   */
  async reloadAsync(filename: string, env: string): Promise<any> {
    await this.readAsync(filename);
    return this.loadAsync(filename, env);
  }

  private getPath(filename: string): string {
    if (this.options == undefined || this.options.basePath == undefined) {
      return resolve(filename);
    }
    return resolve(this.options.basePath, filename);
  }
}

/** Default ConfigLoader */
export const DEFAULT_CONFIG_LOADER = new ConfigLoader();
