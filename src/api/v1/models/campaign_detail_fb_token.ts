'use strict';

// @ts-ignore: Unreachable code error
const { Model } = require('sequelize');
// @ts-ignore: Unreachable code error
module.exports = (sequelize, DataTypes) => {
    class CampaignDetailToken extends Model {
        static associate(models: { fb_campaign: any }) {
            CampaignDetailToken.belongsTo(models.fb_campaign, {
                as: 'fb_ids',
                foreignKey: 'campaign_id',
            });
        }
    }
    CampaignDetailToken.init(
        {
            url: DataTypes.STRING,
            type: DataTypes.STRING,
            number_of_days: DataTypes.INTEGER,
            fb_id: DataTypes.INTEGER,
            campaign_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            tableName: 'fb_campaign_detail',
            modelName: 'fb_campaign_detail',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
    return CampaignDetailToken;
};
