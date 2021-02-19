'use stricts';


const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('../config/multer');
const authService = require('../services/auth-services');

const controller = require('../controllers/document-controller');

router.post('/bidding/:bidding_id',authService.authorize,multer(multerConfig).single('file'),controller.store);
router.get('/bidding/:bidding_id',authService.authorize,controller.index);
router.delete('/:document_id',authService.authorize,controller.delete);

module.exports =router;

