/**
 * node-yaml-config
 * ----------------
 * Load yaml config files
 * Author: Johann-Michael Thiebaut <johann.thiebaut@gmail.com>
 */

import { DEFAULT_CONFIG_LOADER } from 'config-loader';

export * from 'config-loader';
export * from 'config-loader.options';

export const load = DEFAULT_CONFIG_LOADER.loadSync.bind(DEFAULT_CONFIG_LOADER);
export const reload = DEFAULT_CONFIG_LOADER.readSync.bind(
  DEFAULT_CONFIG_LOADER,
);
