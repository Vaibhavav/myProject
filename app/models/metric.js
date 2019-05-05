'use strict';

module.exports = function(sequelize, DataTypes) {

	var Metric = sequelize.define('Metric', {
			name: DataTypes.STRING,
			status: DataTypes.INTEGER(4)
		}
	);

	return Metric;
};
