var fs = require('fs');
var should = require('should');

var loader = require('../lib/node-yaml-config');

var file = __dirname + '/config.yml';
var save_file = __dirname + '/config.yml.bak';
var new_file = __dirname + '/config-reload.yml';

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
  },
  admins: [ "humans", "subhumans", "arachnids" ]
};

var example_new_dev_config = {
  server: {
    port: 8080
  },
  database: {
    host: 'localhost',
    port: 27017,
    db: 'dev_db'
  }
};

var example_new_test_config = {
  server: {
    port: 8080
  },
  database: {
    host: 'localhost',
    port: 27017,
    db: 'test_db'
  }
};

var example_new_prod_config = {
  server: {
    port: 443
  },
  database: {
    host: 'localhost',
    port: 27017,
    db: 'prod_db',
    user: 'dbuser',
    password: 'pass'
  },
  cache: {
    dir: 'cache'
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
        fs.renameSync(file, save_file);
      });

      after(function() {
        fs.renameSync(save_file, file);
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

  describe('#reload()', function() {
    describe('should correctly load the new configurations', function() {

      before(function() {
        fs.renameSync(file, save_file);
        fs.renameSync(new_file, file);

        try {
          loader.reload(file);
        } catch (err) {
          console.log(err);
        }
      });

      after(function() {
        fs.renameSync(file, new_file);
        fs.renameSync(save_file, file);
      });

      it('development', function() {
        should.deepEqual(loader.load(file, 'development'), example_new_dev_config);
      });
      it('test', function() {
        should.deepEqual(loader.load(file, 'test'), example_new_test_config);
      });
      it('production', function() {
        should.deepEqual(loader.load(file, 'production'), example_new_prod_config);
      });
    });
  });
});
