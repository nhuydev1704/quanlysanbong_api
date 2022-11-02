import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(5000),
        MY_SQL: {
            HOST: Joi.string().required().description('My SQL host'),
            PASSWORD: Joi.string().required().description('My SQL password'),
            DATABASE: Joi.string().required().description('My SQL database'),
            PORT_SQL: Joi.number().default(3306),
            DIALECT: Joi.string().default('mysql'),
        },
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const configEnv = {
    domainSwagger: envVars.DOMAIN_SWAGGER,
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mysql: {
        host: envVars.HOST,
        user: envVars.USER_SQL,
        password: envVars.PASSWORD,
        database: envVars.DATABASE,
        port: envVars.PORT_SQL,
        dialect: envVars.DIALECT,
    },
};

export const routeConfig = {
    fb_token: '/fb_token',
    fb_group_keyword: '/fb_group_keyword',
    fb_page_keyword: '/fb_page_keyword',
    fb_post_run: '/fb_post_run',
    report: '/report',
    campaign: '/campaign',

    excel: '/excel',
    importToken: '/importToken',
};
