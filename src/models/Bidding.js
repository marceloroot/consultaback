
const { Model, DataTypes } = require('sequelize');

class Bidding extends Model {
  static init(sequelize) {
    super.init({
        titulo:DataTypes.STRING,
        descricao:DataTypes.STRING,
        dataabertura:DataTypes.DATE,
        dataafechamento:DataTypes.DATE,
        status:DataTypes.INTEGER,
       
    }, {
      sequelize
    });
  }; 

  static associate(models){
    this.belongsTo(models.User,{ foreignKey: 'user_id', as:'user' })
    this.hasMany(models.Comment,{ foreignKey: 'bidding_id', as:'comments' })
    this.hasMany(models.Document,{ foreignKey: 'bidding_id', as:'documents' })
   
  }
}

module.exports = Bidding;


