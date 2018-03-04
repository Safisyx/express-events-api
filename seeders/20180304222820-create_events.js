'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const events = [
      { title: 'Women\'s day', start_date: '2018-03-08',description: 'March around the town from 10 a.m'},
      { title:'Coca party',start_date: '2018-03-19', end_date: '2018-03-20', description: 'Dance and Drink Coca'},
    ].map(myEvent => ({ ...myEvent}))
    return queryInterface.bulkInsert('events', events, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('events', null, {});
  }
};
