const axios = require('axios');
const { workerData, parentPort } = require('worker_threads');
let FormData = require('form-data');
const { default: db } = require('../../models');
const sequelize = require('sequelize');

function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
}

function upsert(values, condition, table) {
    return db[table].findOne({ where: condition }).then(function (obj) {
        // update
        if (obj) return;
        // insert
        return db[table].create(values);
    });
}

// timing wait
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const runSaveFbIds = async (workerDatas) => {
    let fbs = [];
    for (let index = 0; index < workerDatas.fb_ids.length; index++) {
        const url = workerDatas.fb_ids[index]?.url;

        // create form data
        const form = new FormData();
        form.append('link', url);

        // get fb id
        const res = await axios.post('https://id.traodoisub.com/api.php', form);
        if (res?.data?.id) {
            fbs.push({
                url: url,
                fb_post_type: workerDatas?.fb_ids[index]?.type,
                type: workerDatas?.type,
                fb_id: res.data?.id,
                campaign_id: workerDatas?.campaign_id,
                number_of_days: workerDatas?.number_of_days,
            });
        }

        // save to db
        if (index === workerDatas?.fb_ids.length - 1) {
            db.fb_campaign_detail.bulkCreate(fbs);
        }

        // timing wait
        await sleep(4500);
    }
    // const fbsReplace = getUniqueListBy(fbs, 'fb_id');
    for (let idex = 0; idex < fbs.length; idex++) {
        switch (fbs[idex]?.type) {
            case 'group':
                // create to db fb_group_keyword
                upsert(
                    {
                        page_id: fbs[idex]?.fb_id,
                        back_day: fbs[idex]?.number_of_days,
                        status: 0,
                    },
                    { page_id: fbs[idex]?.fb_id },
                    'fb_group_keyword'
                ).catch((err) => console.log('err', err));
                break;
            case 'page':
                upsert(
                    {
                        page_id: fbs[idex]?.fb_id,
                        back_day: fbs[idex]?.number_of_days,
                        status: 0,
                    },
                    { page_id: fbs[idex]?.fb_id },
                    'fb_page_keyword'
                ).catch((err) => console.log('err', err));
                break;
            case 'posts':
                upsert(
                    {
                        fb_page_id: fbs[idex]?.fb_id,
                        fb_post_id: fbs[idex]?.fb_id,
                        status_update_content: 0,
                        status_spy: 0,
                        type: fbs[idex]?.fb_post_type || 'page',
                        message: '',
                    },
                    { fb_page_id: fbs[idex]?.fb_id },
                    'facebook_post_run'
                ).catch((err) => console.log('err', err));
                break;
            default:
                break;
        }
    }
    // return
    parentPort.postMessage('');
};

runSaveFbIds(workerData);
