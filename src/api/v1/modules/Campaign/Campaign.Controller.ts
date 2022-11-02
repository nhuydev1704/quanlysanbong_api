import Excel from 'exceljs';
import { Request, Response } from 'express';
import fs from 'fs';
import httpStatus from 'http-status';
import path from 'path';
import { ApiError, catchAsync } from '../../helpers';
import {
    createCampaign,
    deleteCampaign,
    getCampaignExport,
    getCampains,
    importFBToken,
    updateCampaign,
} from './Campaign.Service';
const getBaseUrl = (req: any) => `https://${req.headers.host}`;

function stringToSlug(str: string) {
    // remove accents
    var from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
        to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], 'gi'), to[i]);
    }

    str = str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-');

    return str;
}

const getPagingData = (data: any, page: number, limit: number, field: string) => {
    const { count: totalItems, rows } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, [field]: rows, totalPages, currentPage };
};

export const CampaignCtrl = {
    get: catchAsync(async (req: Request, res: Response) => {
        const { page, limit, search }: any = req.query;
        const campaigns = await getCampains(search, limit || 12, page || 1);

        res.send(getPagingData(campaigns, page, limit || 12, 'data'));
    }),
    post: catchAsync(async (req: Request, res: Response) => {
        const response = await createCampaign(req.body);

        res.status(httpStatus.CREATED).send(response);
    }),
    put: catchAsync(async (req: Request, res: Response) => {
        const response = await updateCampaign({ ...req.body, campaign_id: req.params.id });

        res.send(response);
    }),
    delete: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await deleteCampaign(id);

        res.status(httpStatus.NO_CONTENT).send();
    }),
    returnExcel: catchAsync(async (req: Request, res: Response) => {
        const { campaign_id, campaign_name }: any = req.query;

        const campaign_names = stringToSlug(campaign_name);

        if (!campaign_id) throw new ApiError(httpStatus.BAD_REQUEST, 'Không tìm thấy chiến dịch');

        // try {
        //     if (fs.existsSync(path.resolve('.', 'uploads', `${campaign_names}.xlsx`))) {
        //         const pathFile = path.resolve('./', 'uploads', `${campaign_names}.xlsx`);
        //         // send link pathFile
        //         res.send((getBaseUrl(req) + pathFile).replace('/app', ''));
        //     }
        // } catch (err) {
        //     return err;
        // }

        // res.send(pathFile);
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Tổng KH');
        const worksheet2 = workbook.addWorksheet('KH có SĐT');
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'cccccc' },
        };
        worksheet2.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'cccccc' },
        };
        worksheet2.columns = [
            { header: 'STT', key: 'id', width: 10 },
            { header: 'Tên chiến dịch', key: 'campaign_name', width: 32 },
            { header: 'Tên khách hàng', key: 'user_name', width: 30 },
            { header: 'Link FB cá nhân', key: 'fb_link', width: 60 },
            { header: 'Số điện thoại', key: 'phone', width: 30 },
            { header: 'Nội dung cmt', key: 'message', width: 30 },
            { header: 'Link bài viết', key: 'post_link', width: 30 },
        ];
        worksheet.columns = [
            { header: 'STT', key: 'id', width: 10 },
            { header: 'Tên chiến dịch', key: 'campaign_name', width: 32 },
            { header: 'Tên khách hàng', key: 'user_name', width: 30 },
            { header: 'Link FB cá nhân', key: 'fb_link', width: 60 },
            { header: 'Số điện thoại', key: 'phone', width: 30 },
            { header: 'Nội dung cmt', key: 'message', width: 80 },
            { header: 'Link bài viết', key: 'post_link', width: 30 },
        ];

        const data = await getCampaignExport(campaign_id);

        const mergerData = [...data.export_posts, ...data.export_members];

        // for mergerData and append to data set
        for (let s1 = 0; s1 < mergerData.length; s1++) {
            const element = mergerData[s1];

            worksheet.addRow({
                ...element,
                fb_link: element?.user_id ? `https://www.facebook.com/${element?.user_id}` : '',
                post_link: element?.post_id ? `https://www.facebook.com/${element?.post_id}` : '',
            });

            if (element?.phone) {
                worksheet2.addRow({
                    ...element,
                    fb_link: element?.user_id ? `https://www.facebook.com/${element?.user_id}` : '',
                    post_link: element?.post_id ? `https://www.facebook.com/${element?.post_id}` : '',
                });
            }
        }

        await workbook.xlsx.writeFile(path.resolve('.', 'uploads', `${campaign_names}.xlsx`));

        const pathFile = path.resolve('./', 'uploads', `${campaign_names}.xlsx`);

        // check success workbook and send link pathFile and exits data
        res.send((getBaseUrl(req) + pathFile).replace('/app', ''));
    }),
    importToken: catchAsync(async (req: Request, res: Response) => {
        const { tokens } = req.body;

        await importFBToken(tokens);

        res.status(httpStatus.CREATED).send();
    }),
};
