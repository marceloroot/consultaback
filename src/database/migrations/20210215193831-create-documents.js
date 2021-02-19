'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
     await queryInterface.createTable('documents', { 
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
          bidding_id:{
            type: Sequelize.INTEGER,
            allowNull: false,
            references:{ model:'biddings', key:'id' },
            onUpdate:'CASCADE',
          },
          name:{
            type: Sequelize.STRING,
            allowNull: false,
          },
          key:{
            type: Sequelize.STRING,
          },
          size:{
            type: Sequelize.INTEGER,
            
          },
          url: {
            type: Sequelize.STRING,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false
          }, 
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false
          }, 
          
          });
      
  },

  down: async (queryInterface, Sequelize) => {
  
      await queryInterface.dropTable('documents');
     
  }
};




