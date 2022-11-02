'use strict';

module.exports = {
    // @ts-ignore: Unreachable code error
    up: (queryInterface) => {
        return queryInterface.bulkInsert('fb_post_run', [
            {
                post: 'Token 1',
                status_spy: 0,
                status_update_content: 0,
            },
            {
                post: 'Token 2',
                status_spy: 1,
                status_update_content: 1,
            },
            {
                post: 'Token 3',
                status_spy: 2,
                status_update_content: 2,
            },
            {
                post: 'Token 4',
                status_spy: 3,
                status_update_content: 3,
            },
        ]);
    },
    // @ts-ignore: Unreachable code error
    down: (queryInterface) => {
        return queryInterface.bulkDelete('fb_post_run', null, {});
    },
};
