'use strict';

module.exports = function(sequelize, DataTypes) {

	var Rules = sequelize.define('Rules', {
			name: DataTypes.STRING,
			schedule: DataTypes.STRING,
			campaign_id: DataTypes.JSON,
			condition: DataTypes.STRING,
			action: DataTypes.STRING,
			status: DataTypes.ENUM('1','0','-1')
		}
	);

	return Rules;
};
