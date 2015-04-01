var fs = require('fs');
var should = require('should');

var loader = require('../lib/node-yaml-config');

var file = __dirname + '/config.yml';
var save_file = __dirname + '/config.yml.bak';
var new_file = __dirname + '/config-reload.yml';

var example_dev_config = {
  server: {
    host: 'localhost',
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
    host: 'localhost',
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
    host: 'appname.rhcloud.com',
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
  username_blacklist: [
    'login',
    'admin',
    'register'
  ]
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

    describe('should fill environment variables', function() {
      it('production', function() {
        //Setting process.env variables is useless since the tests are run in a different process aparrently
        //Hence the setting of the environment variable in package.json
        should.deepEqual(loader.load(file, 'production'), example_prod_config);
      });
    });

    describe('should deserialise array correcly', function() {
      it('production', function() {
        var config = loader.load(file, 'production');
        
        config.username_blacklist.should.be.instanceof(Array).and.have.lengthOf(3);
        config.username_blacklist[0].should.be.equal('login');
        config.username_blacklist[1].should.be.equal('admin');
        config.username_blacklist[2].should.be.equal('register');
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
