'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
     await queryInterface.createTable('comments', { 
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
            onDelete:'CASCADE',
          },
          comentario:{
            type: Sequelize.STRING,
            allowNull: false,
          },
          datacomentario: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
          },
          status: {
            type: Sequelize.INTEGER,
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
  
      await queryInterface.dropTable('comments');
     
  }
};
