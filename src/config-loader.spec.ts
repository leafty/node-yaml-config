import { rename as renameLegacy } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import { ConfigLoader } from './config-loader';

const rename = promisify(renameLegacy);

const testConfigDir = resolve(__dirname, '../test/data');

const configFile = 'config.yml';
const configFileBackup = 'config.yml.bak';
const configFileReload = 'config-reload.yml';

const configFileContents = {
  default: {
    database: { host: 'localhost', port: 27017 },
    server: { port: 3000 },
  },
  development: { database: { db: 'dev_db' } },
  production: {
    admins: ['superadmins', 'staff', 'leads'],
    cache: { dir: 'static' },
    database: { db: 'prod_db', password: 'pass', user: 'dbuser' },
    server: { port: 8000 },
  },
  test: { database: { db: 'test_db' } },
};

const configs = {
  development: {
    database: { db: 'dev_db', host: 'localhost', port: 27017 },
    server: { port: 3000 },
  },
  test: {
    database: { db: 'test_db', host: 'localhost', port: 27017 },
    server: { port: 3000 },
  },
  production: {
    admins: ['superadmins', 'staff', 'leads'],
    cache: { dir: 'static' },
    database: {
      db: 'prod_db',
      host: 'localhost',
      password: 'pass',
      port: 27017,
      user: 'dbuser',
    },
    server: { port: 8000 },
  },
};

const reloadedConfigs = {
  development: {
    database: { db: 'dev_db', host: 'localhost', port: 27017 },
    server: { port: 8080 },
  },
  test: {
    database: { db: 'test_db', host: 'localhost', port: 27017 },
    server: { port: 8080 },
  },
  production: {
    admins: ['superadmins'],
    cache: { dir: 'cache' },
    database: {
      db: 'prod_db',
      host: 'localhost',
      password: 'pass',
      port: 27017,
      user: 'dbuser',
    },
    server: { port: 443 },
  },
};

describe('ConfigLoader', () => {
  let configLoader: ConfigLoader;

  beforeEach(() => {
    configLoader = new ConfigLoader({ basePath: testConfigDir });
  });

  describe('read()', () => {
    it('should read a config file', () => {
      const contents = configLoader.read(configFile);

      expect(contents).toStrictEqual(configFileContents);
    });

    it('should fail when the file does not exist', () => {
      expect(() => {
        configLoader.read('this_file_does_not_exits.yml');
      }).toThrow('ENOENT');
    });
  });

  describe('load()', () => {
    describe('should corectly load the different configurations', () => {
      it('development', () => {
        const config = configLoader.load(configFile, 'development');

        expect(config).toStrictEqual(configs.development);
      });
      it('test', () => {
        const config = configLoader.load(configFile, 'test');

        expect(config).toStrictEqual(configs.test);
      });
      it('production', () => {
        const config = configLoader.load(configFile, 'production');

        expect(config).toStrictEqual(configs.production);
      });
    });

    describe('should not reread the file', () => {
      const move = async () => {
        await rename(
          resolve(testConfigDir, configFile),
          resolve(testConfigDir, configFileBackup),
        );
      };
      const restore = async () => {
        await rename(
          resolve(testConfigDir, configFileBackup),
          resolve(testConfigDir, configFile),
        );
      };

      afterEach(async () => {
        await restore();
      });

      it('development', async () => {
        configLoader.load(configFile);
        await move();

        const config = configLoader.load(configFile, 'development');

        expect(config).toStrictEqual(configs.development);
      });
      it('test', async () => {
        configLoader.load(configFile);
        await move();

        const config = configLoader.load(configFile, 'test');

        expect(config).toStrictEqual(configs.test);
      });
      it('production', async () => {
        configLoader.load(configFile);
        await move();

        const config = configLoader.load(configFile, 'production');

        expect(config).toStrictEqual(configs.production);
      });
    });
  });

  describe('reload()', () => {
    describe('should correctly load the new configurations', () => {
      const move = async () => {
        await rename(
          resolve(testConfigDir, configFile),
          resolve(testConfigDir, configFileBackup),
        );
        await rename(
          resolve(testConfigDir, configFileReload),
          resolve(testConfigDir, configFile),
        );
      };
      const restore = async () => {
        await rename(
          resolve(testConfigDir, configFile),
          resolve(testConfigDir, configFileReload),
        );
        await rename(
          resolve(testConfigDir, configFileBackup),
          resolve(testConfigDir, configFile),
        );
      };

      afterEach(async () => {
        await restore();
      });

      it('development', async () => {
        configLoader.load(configFile);
        await move();

        const config = configLoader.reload(configFile, 'development');

        expect(config).toStrictEqual(reloadedConfigs.development);
      });
      it('test', async () => {
        configLoader.load(configFile);
        await move();

        const config = configLoader.reload(configFile, 'test');

        expect(config).toStrictEqual(reloadedConfigs.test);
      });
      it('production', async () => {
        configLoader.load(configFile);
        await move();

        const config = configLoader.reload(configFile, 'production');

        expect(config).toStrictEqual(reloadedConfigs.production);
      });
    });
  });

  describe('readAsync()', () => {
    it('should read a config file', async () => {
      expect.assertions(1);

      const contents = await configLoader.readAsync(configFile);

      expect(contents).toStrictEqual(configFileContents);
    });

    it('should fail when the file does not exist', async () => {
      expect.assertions(1);

      try {
        await configLoader.readAsync('this_file_does_not_exits.yml');
      } catch (e) {
        expect(e).toMatchObject({
          code: 'ENOENT',
        });
      }
    });
  });

  describe('loadAsync()', () => {
    describe('should corectly load the different configurations', () => {
      it('development', async () => {
        const config = await configLoader.loadAsync(configFile, 'development');

        expect(config).toStrictEqual(configs.development);
      });
      it('test', async () => {
        const config = await configLoader.loadAsync(configFile, 'test');

        expect(config).toStrictEqual(configs.test);
      });
      it('production', async () => {
        const config = await configLoader.loadAsync(configFile, 'production');

        expect(config).toStrictEqual(configs.production);
      });
    });

    describe('should not reread the file', () => {
      const move = async () => {
        await rename(
          resolve(testConfigDir, configFile),
          resolve(testConfigDir, configFileBackup),
        );
      };
      const restore = async () => {
        await rename(
          resolve(testConfigDir, configFileBackup),
          resolve(testConfigDir, configFile),
        );
      };

      afterEach(async () => {
        await restore();
      });

      it('development', async () => {
        await configLoader.loadAsync(configFile);
        await move();

        const config = await configLoader.loadAsync(configFile, 'development');

        expect(config).toStrictEqual(configs.development);
      });
      it('test', async () => {
        await configLoader.loadAsync(configFile);
        await move();

        const config = await configLoader.loadAsync(configFile, 'test');

        expect(config).toStrictEqual(configs.test);
      });
      it('production', async () => {
        await configLoader.loadAsync(configFile);
        await move();

        const config = await configLoader.loadAsync(configFile, 'production');

        expect(config).toStrictEqual(configs.production);
      });
    });
  });

  describe('reloadAsync()', () => {
    describe('should correctly load the new configurations', () => {
      const move = async () => {
        await rename(
          resolve(testConfigDir, configFile),
          resolve(testConfigDir, configFileBackup),
        );
        await rename(
          resolve(testConfigDir, configFileReload),
          resolve(testConfigDir, configFile),
        );
      };
      const restore = async () => {
        await rename(
          resolve(testConfigDir, configFile),
          resolve(testConfigDir, configFileReload),
        );
        await rename(
          resolve(testConfigDir, configFileBackup),
          resolve(testConfigDir, configFile),
        );
      };

      afterEach(async () => {
        await restore();
      });

      it('development', async () => {
        await configLoader.loadAsync(configFile);
        await move();

        const config = await configLoader.reloadAsync(
          configFile,
          'development',
        );

        expect(config).toStrictEqual(reloadedConfigs.development);
      });
      it('test', async () => {
        await configLoader.loadAsync(configFile);
        await move();

        const config = await configLoader.reloadAsync(configFile, 'test');

        expect(config).toStrictEqual(reloadedConfigs.test);
      });
      it('production', async () => {
        await configLoader.loadAsync(configFile);
        await move();

        const config = await configLoader.reloadAsync(configFile, 'production');

        expect(config).toStrictEqual(reloadedConfigs.production);
      });
    });
  });
});
