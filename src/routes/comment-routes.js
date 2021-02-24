'use stricts';


const express = require('express');
const router = express.Router();
const authService = require('../services/auth-services');


const controller = require('../controllers/comment-controller');

router.post('/bidding/:bidding_id',controller.store);
router.get('/bidding/:bidding_id',controller.index);
router.get('/biddingadm/:bidding_id',authService.authorize,controller.indexadmin);
router.put('/status/:id',authService.authorize,controller.publicar);
module.exports =router;

