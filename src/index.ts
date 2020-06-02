/**
 * node-yaml-config
 * ----------------
 * Load yaml config files
 * Author: Johann-Michael Thiebaut <johann.thiebaut@gmail.com>
 */

import { DEFAULT_CONFIG_LOADER } from './config-loader';

export * from './config-loader';
export * from './config-loader.options';

export const read = DEFAULT_CONFIG_LOADER.read.bind(DEFAULT_CONFIG_LOADER);
export const load = DEFAULT_CONFIG_LOADER.load.bind(DEFAULT_CONFIG_LOADER);
export const reload = DEFAULT_CONFIG_LOADER.reload.bind(DEFAULT_CONFIG_LOADER);

export const readAsync = DEFAULT_CONFIG_LOADER.readAsync.bind(
  DEFAULT_CONFIG_LOADER,
);
export const loadAsync = DEFAULT_CONFIG_LOADER.loadAsync.bind(
  DEFAULT_CONFIG_LOADER,
);
export const reloadAsync = DEFAULT_CONFIG_LOADER.reloadAsync.bind(
  DEFAULT_CONFIG_LOADER,
);
