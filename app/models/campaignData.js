'use strict';

module.exports = function(sequelize, DataTypes) {

	var CampaignData = sequelize.define('CampaignData', {
			name: DataTypes.STRING,
			metric: DataTypes.STRING,
			value: DataTypes.STRING,
			status: DataTypes.INTEGER(4)
		}
	);

	return CampaignData;
};
