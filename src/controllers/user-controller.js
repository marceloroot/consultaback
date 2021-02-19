'use strict'
 const User = require('../models/User');
 const authService = require('../services/auth-services');
 const ValidationContract = require('../validator/fluent-validators');
 const md5 = require('md5');
 module.exports ={
    async store(req,res){
        const {nome,
            email,
            password
        } = req.body;

        
        let contract = new ValidationContract();
        contract.hasMinLen(nome, 3,'nome', 'O nome deve conter pelo menos 3 caracteres');
        contract.hasMinLen(password,6,'password','A senha deve conter pelo menos 6 caracteres');
        contract.isEmail(email, 'email','O email deve valido');
        // Se os dados forem inválidos
        if (!contract.isValid()) {
            res.status(200).send(contract.errors()).end();
            return;
        }

        const senha =  md5(req.body.password + process.env.APP_SECRET_KEY);
        const user = await User.create({
            nome,
            email,
            password:senha
        })

        if(!user){
            return res.status(200).send({message:'Erro ao cadastar usuario'});
        }
        
        return res.status(201).send({
            message:'Cadastrado com sucesso',
            data:user
        })
        
    },

    async authenticate(req,res){
        const user = await User.findOne({
            where:{
                email:req.body.email,
                password:md5(req.body.password + process.env.APP_SECRET_KEY)
            }
        });

       

          if(!user){
            res.status(400).send({
                error:'Email ou senha errada'
            });
           }
          
           const token = await authService.generateToken({
                id: user.id,
                email: user.email,
                nome: user.nome
            });

        res.status(201).send({
            access_token: token,
                data: {
                    email: user.email,
                    nome: user.nome
                 }
        });
    },

    async decoude(req,res){
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);
    
        res.status(201).send({
            token: data,
                
        });
    },


   
}