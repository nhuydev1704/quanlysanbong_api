'use strict';

module.exports = {
    // @ts-ignore: Unreachable code error
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('fb_campaign_detail', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            url: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.STRING,
            },
            number_of_days: {
                type: Sequelize.INTEGER,
            },
            fb_id: {
                type: Sequelize.STRING,
            },
            campaign_id: {
                type: Sequelize.INTEGER,
            },
            created_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false,
            },
            updated_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                allowNull: false,
            },
        });
    },
    // @ts-ignore: Unreachable code error
    async down(queryInterface) {
        await queryInterface.dropTable('fb_campaign_detail');
    },
};
