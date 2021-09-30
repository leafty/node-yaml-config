import { load } from 'node-yaml-config';

const config = load('examples/config.yml');

console.log(config);
