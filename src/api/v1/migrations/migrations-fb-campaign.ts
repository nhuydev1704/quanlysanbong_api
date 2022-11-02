'use strict';

module.exports = {
    // @ts-ignore: Unreachable code error
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('fb_campaign', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            fb_count: {
                type: Sequelize.INTEGER,
            },
            status: {
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
        await queryInterface.dropTable('fb_campaign');
    },
};
