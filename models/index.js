import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import cls from 'continuation-local-storage';

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))[env];
const db = {};

const namespace = cls.createNamespace('project-engine.models.transaction');
Sequelize.cls = namespace;

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0
    && path.basename(file, '.js') !== 'index'
  ))
  .forEach(file => {
    try {
      const model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
    } catch (err) {
      if (err.message !== 'defineCall is not a function') {
        throw err;
      }
    }
  });

for (let modelName in db) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  exports[modelName] = db[modelName];
}

exports.sequelize = sequelize;
exports.Sequelize = Sequelize;
