'use strict';

// @ts-ignore: Unreachable code error
const { Model } = require('sequelize');
// @ts-ignore: Unreachable code error
module.exports = (sequelize, DataTypes) => {
    class Campaign extends Model {
        static associate(models: { fb_campaign_detail: any }) {
            Campaign.hasMany(models.fb_campaign_detail, {
                as: 'fb_ids',
                foreignKey: 'campaign_id',
            });
        }
    }
    Campaign.init(
        {
            name: DataTypes.STRING,
            status: DataTypes.INTEGER,
            fb_count: DataTypes.INTEGER,
        },
        {
            sequelize,
            tableName: 'fb_campaign',
            modelName: 'fb_campaign',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
    return Campaign;
};
