'use strict';

module.exports = {
    // @ts-ignore: Unreachable code error
    up: (queryInterface) => {
        return queryInterface.bulkInsert('fb_page_keyword', [
            {
                keyword: 'Công việc 1',
                status: 0,
            },
            {
                keyword: 'Công việc 2',
                status: 1,
            },
            {
                keyword: 'Công việc 3',
                status: 2,
            },
            {
                keyword: 'Công việc 4',
                status: 3,
            },
        ]);
    },
    // @ts-ignore: Unreachable code error
    down: (queryInterface) => {
        return queryInterface.bulkDelete('fb_page_keyword', null, {});
    },
};
