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

/**
* Hash of loaded files
*/

var loaded_files = {};

/**
* Merges properties found in `extension` into `doc`
*/

function merge(doc, extension) {
  var prop;

  for (prop in extension) {
    if (extension.hasOwnProperty(prop)) {
      if (extension[prop] instanceof Object) {
        if (!doc.hasOwnProperty(prop)) {
          doc[prop] = {};
        }
        merge(doc[prop], extension[prop]);
      } else {
        doc[prop] = extension[prop];
      }
    }
  }

  return doc;
}

function replaceEnvVariables(data) {
  switch(typeof(data)) {
    case 'object':
      for(var key in data) {
        if(data.hasOwnProperty(key)) {
          data[key] = replaceEnvVariables(data[key]);
        }
      }
    break;
    case 'array':
      return data.map(function(elem) {
        return replaceEnvVariables(elem);
      });
    break;
    case 'string':
      var pattern = /^\$(\w+)$/;
      if(pattern.test(data)) {
        console.log(process.env);
        var variableName = data.match(pattern)[1];
        return variableName in process.env ? process.env[variableName] : null;
      }
    break;
  }

  return data;
}

/**
* Reads a yaml configuration file
*/

function read(filename) {
  var data = yaml.load(fs.readFileSync(filename));
  data = replaceEnvVariables(data);

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

  return merge(merge({}, default_config), extension_config);
}

/**
* Expose `load`
*/

exports.load = load;

/**
* Expose `reload`
*/

exports.reload = read
