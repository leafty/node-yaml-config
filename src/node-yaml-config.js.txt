/**
* node-yaml-config.js
* -------------------
* Load yaml config files
* Author: Johann-Michael Thiebaut <johann.thiebaut@gmail.com>
*/

/**
* Dependencies
*/

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var extend = require('node.extend');

/**
* Hash of loaded files
*/

var loaded_files = {};

/**
* Reads a yaml configuration file
*/

function read(filename) {
  var data = yaml.load(fs.readFileSync(filename));

  loaded_files[filename] = data;

  return data;
}

/**
* Loads a yaml configuration
* If the file has already been parsed, the file is not read again.
*/

function load(filename, env) {
  var data, default_config, extension_config;

  filename = path.resolve(filename);

  if (loaded_files.hasOwnProperty(filename)) {
    data = loaded_files[filename];
  } else {
    data = read(filename);
  }

  env = env || process.env.NODE_ENV || 'development';

  default_config = data.default || {};
  extension_config = data[env] || {};

  return extend(true, extend(true, {}, default_config), extension_config);
}

/**
* Expose `load`
*/

exports.load = load;

/**
* Expose `reload`
*/

exports.reload = read
