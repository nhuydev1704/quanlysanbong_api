import { Sequelize } from 'sequelize';
import { configEnv } from '.';
console.log('🚀 ~ file: connect.config.ts ~ line 3 ~ configEnv', configEnv);

const { mysql } = configEnv;
// Option 3: Passing parameters separately (other dialects)
const sequelizeConfig = new Sequelize(mysql.database, mysql.user, mysql.password, {
    host: mysql.host,
    port: mysql.port,
    dialect: mysql.dialect,
    logging: false,
    define: {
        timestamps: false,
    },
});

export default sequelizeConfig;
