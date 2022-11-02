import httpStatus from 'http-status';
import path from 'path';
import { Worker } from 'worker_threads';
import { ApiError, catchAsync } from '../../helpers';
import db from '../../models';
import sequelize from 'sequelize';
export const getCampains = async (name: string, limit: number, page: number) => {
    return db.fb_campaign.findAndCountAll({
        where: { name: { [sequelize.Op.like]: `%${name || ''}%` } },
        limit: limit,
        offset: (page - 1) * limit,
        include: [
            {
                model: db.fb_campaign_detail,
                as: 'fb_ids',
                attributes: [
                    'id',
                    'url',
                    'fb_id',
                    'type',
                    'number_of_days',
                    'created_at',
                    // [
                    //     sequelize.literal(
                    //         `IFNULL((SELECT COUNT(fb_group_keyword.id) FROM fb_group_keyword join fb_campaign_detail on fb_group_keyword.page_id =  fb_campaign_detail.fb_id  WHERE fb_campaign_detail.campaign_id = fb_campaign.id group by fb_group_keyword.id ),0)`
                    //     ),
                    //     'count',
                    // ],
                ],
            },
        ],
        attributes: {
            include: [
                'created_at',
                'updated_at',
                [
                    sequelize.literal(
                        `IFNULL((SELECT COUNT(facebook_post_run.id) from fb_campaign as fb_campaigns
                    join fb_campaign_detail on fb_campaign_detail.campaign_id = fb_campaigns.id
                    join facebook_post_run on facebook_post_run.fb_page_id = fb_campaign_detail.fb_id
                    WHERE fb_campaign_detail.campaign_id = fb_campaign.id and fb_campaigns.id = fb_campaign.id),0)`
                    ),
                    'newfeeds',
                ],
                [
                    sequelize.literal(
                        `IFNULL((SELECT COUNT(facebook_post_run.id) from facebook_post_run
                    join fb_campaign_detail on facebook_post_run.fb_page_id = fb_campaign_detail.fb_id
                    WHERE fb_campaign_detail.campaign_id = fb_campaign.id and facebook_post_run.status_update_content >= 3 ),0)`
                    ),
                    'comment_success',
                ],
                [
                    sequelize.literal(
                        `IFNULL((SELECT COUNT(facebook_post_run.id) from facebook_post_run
                    join fb_campaign_detail on facebook_post_run.fb_page_id = fb_campaign_detail.fb_id
                    WHERE fb_campaign_detail.campaign_id = fb_campaign.id and facebook_post_run.type != "page"),0)`
                    ),
                    'reactions',
                ],
                [
                    sequelize.literal(
                        `IFNULL((SELECT COUNT(facebook_post_run.id) from facebook_post_run
                    join fb_campaign_detail on facebook_post_run.fb_page_id = fb_campaign_detail.fb_id
                    WHERE fb_campaign_detail.campaign_id = fb_campaign.id and facebook_post_run.status_spy >= 3 and facebook_post_run.type != "page"),0)`
                    ),
                    'reaction_success',
                ],
            ],
        },
        order: [['created_at', 'DESC']],
        distinct: true,
    });
};

const runService = (workerData: any) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, 'Woker.Campaign.js'), { workerData });

        worker.on('message', resolve);
        worker.on('error', resolve);
        // worker.on('exit', (code) => {
        //     if (code !== 0) reject(new Error(`stopped with  ${code} exit code`));
        // });
    });
};

export const createCampaign = async (campaignBody?: any) => {
    const fb_ids = campaignBody?.fb_ids;
    // const fb_ids = ['https://www.facebook.com/groups/SQLServer.AzureSQLDBandMI'];

    // if (!fb_ids) throw new ApiError(httpStatus.BAD_REQUEST, 'fb_ids is required');

    // find one name in db
    const campaign = await db.fb_campaign.findOne({ where: { name: campaignBody.name } });

    if (campaign) throw new ApiError(httpStatus.BAD_REQUEST, 'Tên chiến dịch đã tổn tại');

    const dataCampaign = {
        name: campaignBody?.name,
        status: campaignBody?.status,
        fb_count: fb_ids?.length || 0,
    };

    return db.fb_campaign
        .create({ ...dataCampaign, raw: true })
        .then(async (campaign: any) => {
            if (fb_ids && campaign?.dataValues?.id) {
                runService({
                    fb_ids,
                    campaign_id: campaign.dataValues.id,
                    type: campaignBody?.type || '',
                    number_of_days: campaignBody?.number_of_days || 0,
                });
            }
            return campaign.dataValues;
        })
        .catch((error: string) => {
            throw new ApiError(httpStatus.BAD_REQUEST, error);
        });
};

export const updateCampaign = async (campaignBody?: any) => {
    const fb_ids = campaignBody?.fb_ids;
    const campaign_id = campaignBody?.campaign_id;

    // find one name in db
    const campaign = await db.fb_campaign.findOne({ where: { id: campaign_id } });

    if (!campaign) throw new ApiError(httpStatus.BAD_REQUEST, 'Chiến dịch không tồn tại');

    if (fb_ids && campaign?.dataValues?.id) {
        runService({
            fb_ids,
            campaign_id,
            type: campaignBody?.type || '',
            number_of_days: campaignBody?.number_of_days || 0,
        });
    }

    // update fb_count in fb_campaign
    const dataCampaign = {
        fb_count: (fb_ids?.length || 0) + campaign?.dataValues?.fb_count,
    };

    return db.fb_campaign.update(dataCampaign, { where: { id: campaign_id } });
};

export const deleteCampaign = async (id: any) => {
    // check id in db
    const findCampaign = await db.fb_campaign.findOne({ where: { id } });

    if (!findCampaign) throw new ApiError(httpStatus.BAD_REQUEST, 'Không tìm thấy chiến dịch');

    return db.fb_campaign.destroy({ where: { id } });
};

// get campaign export

export const getCampaignExport = async (id = 3) => {
    // check id in db
    const findCampaign = await db.fb_campaign.findOne({ where: { id } });

    if (!findCampaign) throw new ApiError(httpStatus.BAD_REQUEST, 'Không tìm thấy chiến dịch');

    return db.fb_campaign.findOne({
        where: { id },
        attributes: {
            include: [
                'created_at',
                'updated_at',
                [
                    sequelize.literal(
                        `IFNULL((SELECT JSON_ARRAYAGG(fbCampaign.list_custom_for_customer_post) as list_custom_for_customer_post
                    from (
                    SELECT JSON_OBJECT("campaign_name", fb_campaign.name, "user_name", post.user_name,"user_id",post.user_id,"message",post.message, "phone", post.phone_convert, "type", fb_campaign_details.type,"post_id", post.post_id)
                    as list_custom_for_customer_post
                    FROM fb_campaign as fb_campaigns
                    join fb_campaign_detail fb_campaign_details
                    on fb_campaign_details.campaign_id = fb_campaigns.id
                    join custom_for_customer_post as post 
                    on post.page_id = fb_campaign_details.fb_id
                    where
                    fb_campaigns.id = fb_campaign.id
                     group by post.id
                     order by post.id desc
                     ) as fbCampaign
                     LIMIT 1
                     ),JSON_ARRAY())`
                    ),
                    'export_posts',
                ],
                [
                    sequelize.literal(
                        `IFNULL((SELECT JSON_ARRAYAGG(fbGroup.list_member_group) as list_member_group
                    from (
                    SELECT JSON_OBJECT("campaign_name", fb_campaign.name, "user_name", member_groups.user_name,"user_id",member_groups.user_id, "phone", member_groups.phone, "type", fb_campaign_details.type)
                    as list_member_group
                    FROM fb_campaign as fb_campaigns
                    join fb_campaign_detail fb_campaign_details
                    on fb_campaign_details.campaign_id = fb_campaigns.id
                    join member_group as member_groups 
                    on member_groups.group_id = fb_campaign_details.fb_id
                    where
                    fb_campaigns.id = fb_campaign.id
                     group by member_groups.id
                     order by member_groups.id desc
                     ) as fbGroup
                     LIMIT 1
                     ),JSON_ARRAY())`
                    ),
                    'export_members',
                ],
            ],
        },
        order: [['created_at', 'DESC']],
        distinct: true,
        raw: true,
    });
};

export const importFBToken = (data: { token: string; status: number }) => {
    // check data
    if (!data) throw new ApiError(httpStatus.BAD_REQUEST, 'Dữ liệu có vấn đề');
    // bulkCreate data
    return db.fb_token.bulkCreate(data);
};

// https://www.facebook.com/user_id
