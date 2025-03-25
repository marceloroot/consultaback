"use strict";
const ValidationContract = require("../validator/fluent-validators");
const Bidding = require("../models/Bidding");
const authService = require("../services/auth-services");
const { sequelize } = require("../models/Bidding");
const { minioClient } = require("../config/minio");
const { bucketName } = require("../config/variables");
module.exports = {
  async index(req, res, next) {
    const biddings = await Bidding.findAll({
      order: [["id", "DESC"]],
    });
    return res.status(200).json(biddings);
  },

  async indexhome(req, res, next) {
    const biddings = await Bidding.findAll({
      where: { status: 1 },
      order: [["id", "DESC"]],
      limit: 6,
    });
    return res.status(200).json(biddings);
  },

  async store(req, res, next) {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const data = await authService.decodeToken(token);

    const {
      titulo,
      descricao,
      dataabertura,
      dataafechamento,
      user_id = data.id,
    } = req.body;

    let contract = new ValidationContract();
    contract.isRequired(titulo, "titulo", "O titulo é obrigatorio");
    contract.isRequired(descricao, "descricao", "O descricao  é obrigatorio");
    contract.isRequired(
      dataabertura,
      "dataabertura",
      "A dataabertura é obrigatoria"
    );
    contract.isRequired(
      dataafechamento,
      "dataafechamento",
      "A dataafechamento é obrigatoria"
    );
    // Se os dados forem inválidos
    if (!contract.isValid()) {
      return res.status(200).send({
        error: contract.errors(),
      });
    }

    const bidding = await Bidding.create({
      user_id,
      titulo,
      descricao,
      dataabertura,
      dataafechamento,
      status: 0,
    });
    return res.status(201).json({
      msg: "cadastrado com sucesso",
      data: bidding,
    });
  },

  async update(req, res, next) {
    const { id } = req.params;
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const data = await authService.decodeToken(token);

    const {
      titulo,
      descricao,
      dataabertura,
      dataafechamento,
      user_id = data.id,
    } = req.body;

    let contract = new ValidationContract();
    contract.isRequired(titulo, "titulo", "O titulo é obrigatorio");
    contract.isRequired(descricao, "descricao", "O descricao  é obrigatorio");
    contract.isRequired(
      dataabertura,
      "dataabertura",
      "A dataabertura é obrigatoria"
    );
    contract.isRequired(
      dataafechamento,
      "dataafechamento",
      "A dataafechamento é obrigatoria"
    );
    // Se os dados forem inválidos
    if (!contract.isValid()) {
      return res.status(200).send({
        error: contract.errors(),
      });
    }
    const bidding = await Bidding.findByPk(id);
    if (!bidding) {
      return res.status(201).json({
        msg: "Licitacao não existe",
      });
    }

    const biddingAtualizado = await Bidding.update(
      { titulo, descricao, dataabertura, dataafechamento, user_id },
      {
        where: {
          id,
        },
      }
    );

    return res.status(201).json({
      msg: "cadastrado com sucesso",
      data: biddingAtualizado,
    });
  },

  async publicar(req, res, next) {
    const { id } = req.params;
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const data = await authService.decodeToken(token);

    const bidding = await Bidding.findByPk(id);
    if (!bidding) {
      return res.status(201).json({
        msg: "Licitacao não existe",
      });
    }

    const biddingAtualizado = await Bidding.update(
      { status: bidding.status === 0 ? 1 : 0 },
      {
        where: {
          id,
        },
      }
    );

    return res.status(201).json({
      msg: "Atualizado com sucesso",
      data: biddingAtualizado,
    });
  },

  async show(req, res, next) {
    const { id } = req.params;
    const biddings = await Bidding.findByPk(id);
    return res.status(200).json(biddings);
  },

  async showhome(req, res, next) {
    const { id } = req.params;

    const bidding = await Bidding.findOne({
      where: sequelize.and({ status: 1 }, { id: id }),
      include: "documents",
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
};
