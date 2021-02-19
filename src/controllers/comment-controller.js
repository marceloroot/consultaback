'use strict'
 const Comment = require('../models/Comment');
 const Bidding = require('../models/Bidding');
module.exports ={
   async store(req,res){
       const { bidding_id } = req.params;
       const{comentario,datacomentario,status} = req.body;
       const bidding = await Bidding.findByPk(bidding_id);
     
        if(!bidding){
            return res.status(400).send({error:'Bidding não encontrado'});
        }

        const comment= await Comment.create({comentario,datacomentario,status,bidding_id});

          return res.status(201).send({
              msg:'comentario cadastrado com sucesso',
              data:comment,
          });
    },


    async index(req,res){
        const { bidding_id } = req.params;
        const bidding = await Bidding.findByPk(bidding_id,{
         include:{association:'comments'}
         });
        return res.json(bidding.comments);
    }

   
}