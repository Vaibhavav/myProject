'use strict';

module.exports = function(sequelize, DataTypes) {

	var Campaign = sequelize.define('Campaign', {
			name: DataTypes.STRING,
			status: DataTypes.INTEGER(4)
		}
	);

	return Campaign;
};
