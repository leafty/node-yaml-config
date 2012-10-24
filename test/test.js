var fs = require('fs');
var should = require('should');

var loader = require('../lib/node-yaml-config');

var file = __dirname + '/config.yml';

var example_dev_config = {
  server: { 
    port: 3000
  },
  database: {
    host: 'localhost',
    port: 27017,
    db: 'dev_db'
  }
};

var example_test_config = {
  server: { 
    port: 3000
  },
  database: {
    host: 'localhost',
    port: 27017,
    db: 'test_db'
  }
};

var example_prod_config = {
  server: { 
    port: 8000
  },
  database: {
    host: 'localhost',
    port: 27017,
    db: 'prod_db',
    user: 'dbuser',
    password: 'pass'
  },
  cache: {
    dir: 'static'
  }
};

describe('node-yaml-config', function() {
  describe('#load()', function() {
    describe('should corectly load the different configurations', function() {
      it('development', function() {
        should.deepEqual(loader.load(file, 'development'), example_dev_config);
      });
      it('test', function() {
        should.deepEqual(loader.load(file, 'test'), example_test_config);
      });
      it('production', function() {
        should.deepEqual(loader.load(file, 'production'), example_prod_config);
      });
    });
    describe('should not reread the file', function() {

      before(function() {
        fs.renameSync(file, __dirname + '/../examples/config.yml.bak');
      });

      after(function() {
        fs.renameSync(__dirname + '/../examples/config.yml.bak', file);
      });

      it('development', function() {
        should.deepEqual(loader.load(file, 'development'), example_dev_config);
      });
      it('test', function() {
        should.deepEqual(loader.load(file, 'test'), example_test_config);
      });
      it('production', function() {
        should.deepEqual(loader.load(file, 'production'), example_prod_config);
      });
    });
  });
});
