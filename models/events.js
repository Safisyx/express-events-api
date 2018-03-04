'use strict';
module.exports = (sequelize, DataTypes) => {
  var events = sequelize.define('events', {
    title: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    description: DataTypes.STRING
  }, {});
  events.associate = function(models) {
    // associations can be defined here
  };
  return events;
};
