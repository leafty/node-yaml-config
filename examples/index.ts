import { load } from 'node-yaml-config';
import { resolve } from 'path';

const config = load(resolve(__dirname, 'config.yml'));

console.log(config);
