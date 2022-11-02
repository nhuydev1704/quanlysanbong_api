// mongo
import { configEnv } from './src/config';
import logger from './src/config/logger.config';
import sequelize from './src/config/connect.config';
import app from './app';

let server: any;

sequelize
    .authenticate()
    .then(() => {
        logger.info('Connected to MySQL');
    })
    .catch((err: any) => {
        logger.error('Error connecting to MySQL', err);
    });

server = app.listen(configEnv.port, () => {
    console.log(`Server running on port ${configEnv.port}`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: any) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
