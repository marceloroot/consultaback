
const { Model, DataTypes } = require('sequelize');

class Comment extends Model {
  static init(sequelize) {
    super.init({
    
        nome:DataTypes.STRING,
        cpf:DataTypes.STRING,
        comentario:DataTypes.STRING,
        datacomentario:DataTypes.DATE,
        status:DataTypes.INTEGER,
       
    }, {
      sequelize
    });
  };

  static associate(models){
    this.belongsTo(models.Bidding,{ foreignKey: 'bidding_id', as:'bidding' })
  }

 

}

module.exports = Comment;


