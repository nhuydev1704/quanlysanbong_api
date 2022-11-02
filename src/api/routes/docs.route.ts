import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from '../../docs/swaggerDef';

const docsRouter = express.Router();

const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ['src/docs/*.yml', 'src/api/v1/modules/*/*.Route.ts'],
});

docsRouter.use('/', swaggerUi.serve);
docsRouter.get(
    '/',
    swaggerUi.setup(specs, {
        explorer: true,
    })
);

export default docsRouter;
