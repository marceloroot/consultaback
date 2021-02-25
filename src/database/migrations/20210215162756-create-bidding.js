'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
     await queryInterface.createTable('biddings', { 
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        user_id:{
          type: Sequelize.INTEGER,
          allowNull: false,
          references:{ model:'users', key:'id' },
          onUpdate:'CASCADE',
          onDelete:'CASCADE',
        },
        titulo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        descricao: {
            type: Sequelize.STRING(2000),
            allowNull: false
        },
        dataabertura: {
            type: Sequelize.DATE,
        },

        dataafechamento: {
          type: Sequelize.DATE,
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
  
      await queryInterface.dropTable('biddings');
     
  }
};
