'use stricts';


const express = require('express');
const router = express.Router();
const authService = require('../services/auth-services');
const controller = require('../controllers/user-controller');

router.post('/',authService.authorize,controller.store);
router.post('/authenticate',controller.authenticate);
router.post('/decode',controller.decoude);
module.exports =router;

