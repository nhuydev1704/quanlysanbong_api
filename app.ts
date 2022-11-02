import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import compression from 'compression';
import { ApiError } from './src/api/v1/helpers';
import { configEnv } from './src/config';
import { errorConverter, errorHandler } from './src/api/v1/middlewares/error';
import router from './src/api/routes';
import { successHandler } from './src/config/morgan.config';

const app = express();
// setup socket
// enable cors
app.use(
    // cors({
    //     origin: `${process.env.CLIENT_URL}`,
    //     credentials: true,
    // })
    cors({
        origin: '*',
        credentials: true,
    })
);

// set security HTTP headers
app.use(helmet());

if (configEnv.env !== 'test') {
    app.use(successHandler);
    app.use(errorHandler);
}
// enable download file
// app.use(express.static('uploads'));
//  use folder uploads
app.use('/uploads', express.static('uploads'));

// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: false }));

// app.use(express.text({ type: 'text/html' }));

// gzip compression
app.use(compression());

// v1 api routes
app.use('/api', router);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Trang không tồn tại'));
});
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
