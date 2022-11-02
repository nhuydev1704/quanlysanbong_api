// @ts-ignore: Unreachable code error
import { version } from '../../package.json';

import { configEnv } from '../config';

const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'node-express-boilerplate API documentation',
        version,
        license: {
            name: 'MIT',
            url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
        },
    },
    servers: [
        {
            url: configEnv.env === 'production' ? configEnv.domainSwagger : `http://localhost:${configEnv.port}/api/v1`,
        },
    ],
};

export default swaggerDef;
