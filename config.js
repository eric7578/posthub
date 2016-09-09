import fs from 'fs';
import ini from 'ini';
import path from 'path';

export const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '.config');
const config = ini.parse(fs.readFileSync(configPath, 'utf8'))[env];

export const database = config.database;
export const cache = config.cache;
export default {
  ...config,
  env
};
