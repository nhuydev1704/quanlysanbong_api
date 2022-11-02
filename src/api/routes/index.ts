import express from 'express';
import CampaignRouter from '../v1/modules/Campaign/Campaign.Route';
import FBGroupKeywordRouter from '../v1/modules/FBGroupKeyword/FBGroupKeyword.Route';
import FBPageKeywordRouter from '../v1/modules/FBPageKeyword/FBPageKeyword.Route';
import FBPostRunRouter from '../v1/modules/FBPostRun/FBPostRun.Route';
import FBTokenRouter from '../v1/modules/FBToken/FBToken.Route';
import ReportRouter from '../v1/modules/Report/Report.Route';
import docsRouter from './docs.route';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/v1',
        route: FBTokenRouter,
    },
    {
        path: '/v1',
        route: FBPageKeywordRouter,
    },
    {
        path: '/v1',
        route: FBGroupKeywordRouter,
    },
    {
        path: '/v1',
        route: FBPostRunRouter,
    },
    {
        path: '/v1',
        route: ReportRouter,
    },
    {
        path: '/v1',
        route: CampaignRouter,
    },
];

const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docsRouter,
    },
];

defaultRoutes.forEach((route: any) => {
    router.use(route.path, route.route);
});

/* istanbul ignore next */
devRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
