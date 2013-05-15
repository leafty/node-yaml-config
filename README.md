# node-yaml-config

Write your configuration files for node.js in yaml

## Installation

```bash
npm install node-yaml-config
```

## Usage

```js
var yaml_config = require('node-yaml-config');

var config = yaml_config.load(__dirname + '/config/config.yml');

console.log(config); 
```

## Configuration Files

In your configuration file:

```yaml
default:
  server:
    port: 3000
  database:
    host: 'localhost'
    port: 27017
development:
  database:
    db: 'dev_db'
test:
  database:
    db: 'test_db'
production:
  server:
    port: 8000
  database:
    db: 'prod_db'
    user: 'dbuser'
    password: 'pass'
  cache:
    dir: 'static'
```

**node-yaml-config** takes the configuration found in default, then overwrites it with the values found in the environment specific parts. The configuration file is loaded synchronously.

## API

### load(filename[, env])

Load the configuration found in `filename` with the environment based on `NODE_ENV`. The environment can be forced with the `env` argument.

**node-yaml-config** keeps parsed yaml files in memory to avoid reading files again.

### reload(filename)

Reload the configuration found in `filename`. Later calls to `load` will show the new configuration.

The file is loaded synchronously.

## License

Copyright (c) 2012-2013 Johann-Michael Thiebaut <[johann.thiebaut@gmail.com](mailto:johann.thiebaut@gmail.com)>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
