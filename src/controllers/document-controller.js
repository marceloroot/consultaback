"use strict";
const Document = require("../models/Document");
const Bidding = require("../models/Bidding");
const { minioClient } = require("../config/minio");
const { v4: uuidv4 } = require("uuid");
const { bucketName } = require("../config/variables");
module.exports = {
  async store(req, res) {
    const { bidding_id } = req.params;
    const { originalname: name, size, buffer } = req.file; // Acesse o buffer
    const bidding = await Bidding.findByPk(bidding_id);

    if (!bidding) {
      return res.status(400).send({ error: "Licitação não encontrada" });
    }

    // Gere o nome do arquivo no controller
    const timestamp = Date.now();

    const key = `${timestamp}-${uuidv4()}.pdf`;
    try {
      // Use putObject com o buffer [[1]][[9]]
      await minioClient.putObject(bucketName, key, buffer);

      const document = await Document.create({ name, size, key, bidding_id });
      return res
        .status(201)
        .send({ msg: "Documento cadastrado", data: document });
    } catch (error) {
      console.error("Erro:", error);
      return res.status(500).send({ error: "Falha ao processar o documento" });
    }
  },

  async index(req, res) {
    const { bidding_id } = req.params;
    const bidding = await Bidding.findByPk(bidding_id, {
      include: { association: "documents" },
    });

    if (!bidding) {
      return res.status(404).json({ error: "Licitação não encontrada" });
    }

    // Função para gerar URLs assinadas [[6]]
    const generateSignedUrls = async (keys) => {
      const results = [];
      for (const key of keys) {
        try {
          await minioClient.statObject(bucketName, key);
          const url = await minioClient.presignedGetObject(
            bucketName,
            key,
            3600 // 1 hora de validade [[9]]
          );
          results.push({ key, url });
        } catch (error) {
          if (error?.code === "NotFound") {
            results.push({ key, error: "Objeto não encontrado" });
          } else {
            results.push({ key, error: "Erro ao gerar URL" });
            console.error(`Erro para ${key}:`, error);
          }
        }
      }
      return results;
    };

    // Processa URLs assinadas
    const keys = bidding.documents.map((doc) => doc.key);
    const signedUrls = await generateSignedUrls(keys);
    const urlMap = new Map(signedUrls.map((item) => [item.key, item]));

    // Cria uma nova estrutura de resposta [[1]]
    const responseBidding = {
      ...bidding.toJSON(), // Copia todos os campos do bidding original
      documents: bidding.documents.map((doc) => ({
        ...doc.toJSON(),
        url: urlMap.get(doc.key)?.url || null,
        error: urlMap.get(doc.key)?.error || null,
      })),
    };

    return res.json(responseBidding);
  },

  async delete(req, res) {
    const { document_id } = req.params;
    const document = Document.findByPk(document_id);
    if (!document) {
      return res.status(400).send({ error: "Documento não encontrado" });
    }
    const removeDocument = await Document.destroy({
      where: { id: document_id },
      individualHooks: true,
    });
    if (removeDocument <= 0) {
      res.json({ msg: "Documento não removido" });
    }

    res.json({ msg: "Documento removido com sucesso", id: document_id });
  },
};
