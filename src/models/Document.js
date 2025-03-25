const { Model, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
class Document extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        size: DataTypes.STRING,
        key: DataTypes.STRING,
        url: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );

    Document.beforeCreate("UrlValida", async (Document) => {
      if (!Document.url) {
        Document.url = `${process.env.APP_URL}/files/${Document.key}`;
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.Bidding, {
      foreignKey: "bidding_id",
      as: "document",
    });
  }
}

module.exports = Document;
