'use strict'
 const Comment = require('../models/Comment');
 const Bidding = require('../models/Bidding');
 const ValidationContract = require('../validator/fluent-validators');
 const authService = require('../services/auth-services');
const { sequelize } = require('../models/Comment');
module.exports ={
   async store(req,res){
       const { bidding_id } = req.params;
       const{nome,cpf,comentario} = req.body;
       const bidding = await Bidding.findByPk(bidding_id);
     
        if(!bidding){
            return res.status(400).send({error:'Bidding não encontrado'});
        }

        let contract = new ValidationContract();
        contract.isRequired(nome, 'nome', 'O nome é obrigatorio');
        contract.isRequired(cpf, 'cpf', 'O cpf  é obrigatorio');
        contract.isRequired(comentario, 'comentario', 'O comentario é obrigatorio');
   
        // Se os dados forem inválidos
        if (!contract.isValid()) {
            

            return res.status(200).send({
               error:contract.errors()
            })
           
        }

       if(bidding.status !==1){
        return res.status(200).send({
            msg:'np',
        
        });
       }
        
        const datacomentario  = new Date().toISOString()
        const datacomentario2  = new Date();
     
        if(datacomentario2 > bidding.dataafechamento)
        {
            return res.status(200).send({
                tm:'Conusulta terminou',
            
            });
        }
        const status =1;

        const comment= await Comment.create({nome,cpf,comentario,datacomentario,status,bidding_id});

          return res.status(201).send({
              msg:'comentario cadastrado com sucesso',
              data:comment,
          });
    },


    async index(req,res){
        const { bidding_id } = req.params;

       console.log(bidding_id)
        const comentarios = await Comment.findAll({
            where: sequelize.and(
                {bidding_id:bidding_id},
                {status:1}
            ),

            order: [
                ['id', 'DESC']
            ],
      
  
        });

        
       
        return res.status(200).send({comentarios});
    },

    
    async indexadmin(req,res){
        const { bidding_id } = req.params;

       console.log(bidding_id)
        const comentarios = await Comment.findAll({
            where: {bidding_id:bidding_id},
               
        

            order: [
                ['id', 'DESC']
            ],
      
  
        });

        
       
        return res.status(200).send({comentarios});
    },

    async publicar(req,res,next){

        const { id } = req.params;
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

      
        
        const comentario = await Comment.findOne({
            where:{id:id},
            include: 'bidding'
        });
        if(!comentario){
            return res.status(201).json({
                msg:'Comentario não existe',
               
            })
          }
      
      const comentarioAtualizado = await Comment.update({status:(comentario.status ===0) ? 1 : 0}, {
        where: {
          id
        },
    })

  
   return res.status(201).json({
       msg:'Atualizado com sucesso',
       data:comentario,
   })
    },

   
}