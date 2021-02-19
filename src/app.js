'use strict'
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); 

require('./database');///importante erro de lenght
const app = express();
var cors = require('cors')
const router = express.Router();
const path = require('path');

//Carrega rota
const indexRoute =require('./routes/index-route');
const biddingRoute =require('./routes/licitacao-routes');
const commentRoute =require('./routes/comment-routes');
const documentRoute =require('./routes/document-routes');
const userRoute =require('./routes/user-routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/files',express.static(path.resolve(__dirname, '..','tmp','uploads')));

// Habilita o CORS
app.use(cors());
app.use('/',indexRoute);
app.use('/bidding',biddingRoute);
app.use('/comment',commentRoute);
app.use('/document',documentRoute);
app.use('/user',userRoute);


module.exports =app;

