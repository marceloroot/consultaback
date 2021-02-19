
const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      nome:DataTypes.STRING,
      email:DataTypes.STRING,
      password:DataTypes.STRING,
       
    }, {
      sequelize
    });
  };

  static associate(models){
    this.hasMany(models.Bidding,{ foreignKey: 'user_id', as:'licitacaoes' })
  }

 

}

module.exports = User;





