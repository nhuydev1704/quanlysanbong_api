import express from 'express';
import { routeConfig } from '../../../../config';
import { CampaignCtrl } from './Campaign.Controller';
const CampaignRouter = express.Router();

CampaignRouter.route(routeConfig.campaign).get(CampaignCtrl.get).post(CampaignCtrl.post);
CampaignRouter.route(routeConfig.campaign + '/:id')
    .delete(CampaignCtrl.delete)
    .put(CampaignCtrl.put);

CampaignRouter.route(routeConfig.excel).get(CampaignCtrl.returnExcel);
CampaignRouter.route(routeConfig.importToken).post(CampaignCtrl.importToken);

/**
 * @swagger
 * tags:
 *   name: Campaign
 *   description: Campaign management and retrieval
 */

/**
 * @swagger
 * /campaign:
 *   post:
 *     summary: Tạo chiến dịch
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: number
 *               fb_ids:
 *                 type: array
 *               number_of_days:
 *                 type: number
 *             example:
 *               name: Tên chiến dịch
 *               type: group
 *               status: 0
 *               fb_ids: [{url: "https://www.facebook.com/groups/SQLServer.AzureSQLDBandMI"}, {url: "https://www.facebook.com/groups/SQLServer.AzureSQLDBandMI"}]
 *               number_of_days: 10
 *     responses:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *
 *   get:
 *     summary: Get all campaigns
 *     description: Get all campaigns
 *     tags: [Campaign]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên chiến dịch
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Số trang
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /campaign/{id}:
 *   put:
 *     summary: cập nhật nguồn theo id chiến dịch
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               status:
 *                 type: number
 *               fb_ids:
 *                 type: array
 *               number_of_days:
 *                 type: number
 *             example:
 *               type: group
 *               status: 0
 *               fb_ids: [{url: "https://www.facebook.com/groups/SQLServer.AzureSQLDBandMI"}, {url:"https://www.facebook.com/groups/SQLServer.AzureSQLDBandMI"}]
 *               number_of_days: 10
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *   delete:
 *     summary: Delete a user
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

export default CampaignRouter;
