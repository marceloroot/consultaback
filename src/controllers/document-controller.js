'use strict'
 const Document = require('../models/Document');
 const Bidding = require('../models/Bidding');
module.exports ={
   async store(req,res){
   
    
       const { bidding_id } = req.params;
       const {originalname:name, size, filename:key,url=""} = req.file;
       const bidding = await Bidding.findByPk(bidding_id);
     
        if(!bidding){
            return res.status(400).send({error:'Licitacao não encontrado'});
        }

        const document= await Document.create({
            name,
            size,
            key,
            url:'',
            bidding_id
         });
        
          return res.status(201).send({
              msg:'Documento cadastrado com sucesso',
              data:document,
          });
          
        
    },


    async index(req,res){
        const { bidding_id } = req.params;
        const bidding = await Bidding.findByPk(bidding_id,{
         include:{association:'documents'}
         });
         if(!bidding){
             return res.json('Nada encotrando')
         }
        return res.json(bidding);
    },


    async delete(req,res){
        const { document_id } = req.params;
        const document = Document.findByPk(document_id);
        if(!document){
            return res.status(400).send({error:'Documento não encontrado'});
        }
        const removeDocument = await Document.destroy(
            {
                where:{id:document_id,},
                individualHooks: true
            });
           if(removeDocument<=0){
            res.json({msg:'Documento não removido'})
           }
       
             res.json({msg:'Documento removido com sucesso',id:document_id})
    }

   
}