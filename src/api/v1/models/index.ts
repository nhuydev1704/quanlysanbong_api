'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { configEnv } from '../../../config';
import sequelizeConfig from '../../../config/connect.config';
const basename = path.basename(__filename);

// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/database.json')[env];
const db: any = {};

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === (configEnv.env === 'production' ? '.js' : '.ts')
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelizeConfig, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelizeConfig;
db.Sequelize = Sequelize;

export default db;
