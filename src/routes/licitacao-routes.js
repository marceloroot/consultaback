'use stricts';


const express = require('express');
const router = express.Router();
const authService = require('../services/auth-services');
const controller = require('../controllers/licitacao-controller');

router.post('/',authService.authorize,controller.store);
router.get('/',authService.authorize,controller.index);
router.get('/:id',authService.authorize,controller.show);
router.put('/:id',authService.authorize,controller.update);
router.put('/status/:id',authService.authorize,controller.publicar);
module.exports =router;

