const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User')
const Bidding = require('../models/Bidding')
const Comment = require('../models/Comment')
const Document = require('../models/Document')

const connection = new Sequelize(dbConfig);

User.init(connection);
Bidding.init(connection);
Comment.init(connection);
Document.init(connection);


//associate
User.associate(connection.models);
Comment.associate(connection.models);
Bidding.associate(connection.models);
Document.associate(connection.models);



module.exports =connection;