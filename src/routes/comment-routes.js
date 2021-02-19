'use stricts';


const express = require('express');
const router = express.Router();


const controller = require('../controllers/comment-controller');

router.post('/bidding/:bidding_id',controller.store);
router.get('/bidding/:bidding_id',controller.index);

module.exports =router;

