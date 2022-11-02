'use strict';

module.exports = {
    // @ts-ignore: Unreachable code error
    up: (queryInterface) => {
        return queryInterface.bulkInsert('fb_token', [
            {
                token: 'Công việc 1',
                status: 0,
            },
            {
                token: 'Công việc 2',
                status: 1,
            },
            {
                token: 'Công việc 3',
                status: 2,
            },
            {
                token: 'Công việc 4',
                status: 3,
            },
        ]);
    },
    // @ts-ignore: Unreachable code error
    down: (queryInterface) => {
        return queryInterface.bulkDelete('fb_token', null, {});
    },
};
