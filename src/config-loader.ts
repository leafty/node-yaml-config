/**
* config-loader.ts
* ----------------
* ConfigLoader is the class used to load yaml config files
* Author: Johann-Michael Thiebaut <johann.thiebaut@gmail.com>
*/

import { ConfigLoaderOptions } from './config-loader.options';
import {load} from 'js-yaml'
import {resolve} from 'path'
import {readFile as readFileLegacy, readFileSync} from 'fs'
import {promisify} from 'util'
import * as extend from 'node.extend'

const readFile = promisify(readFileLegacy)

/** Loads configuration from yaml files */
export class ConfigLoader {
  private readonly loadedFiles: Record<string, any> = {};

  constructor(private readonly options?: ConfigLoaderOptions) {}

  async read(filename: string): Promise<any> {
    const path = this.getPath(filename)
    const data = load(await readFile(path, {encoding: 'utf-8'}))
    this.loadedFiles[path] = data
    return data
  }

  async load(filename: string, env: string): Promise<any> {
    const path = this.getPath(filename)
    let data: any

    if (this.loadedFiles.hasOwnProperty(path)) {
      data = this.loadedFiles[path]
    } else {
      data = await this.read(filename);
    }

    const _env = env || process.env.NODE_ENV || 'development';
    const defaultConfig = data.default || {};
    const extensionConfig = data[env] || {};

    return extend(true, extend(true, {}, defaultConfig), extensionConfig);
  }

  async reload(filename: string, env: string): Promise<any> {
    await this.read(filename)
    return this.load(filename, env)
  }

  readSync(filename: string): any {
    const path = this.getPath(filename)
    const data = load(readFileSync(path, {encoding: 'utf-8'}))
    this.loadedFiles[path] = data
    return data
  }

  loadSync(filename: string, env: string): any {
    const path = this.getPath(filename)
    let data: any

    if (this.loadedFiles.hasOwnProperty(path)) {
      data = this.loadedFiles[path]
    } else {
      data = this.readSync(filename);
    }

    const _env = env || process.env.NODE_ENV || 'development';
    const defaultConfig = data.default || {};
    const extensionConfig = data[env] || {};

    return extend(true, extend(true, {}, defaultConfig), extensionConfig);
  }

  private getPath(filename: string): string {
    if (this.options == undefined || this.options.basePath == undefined) {
      return resolve(filename)
    }
    return resolve(this.options.basePath, filename)
  }
}

/** Default ConfigLoader */
export const DEFAULT_CONFIG_LOADER = new ConfigLoader();
