const express = require('express');
const router = express.Router();
const localizacaoController = require('../controllers/localizacaoController');

// 🔹 Criar uma nova localização
router.post('/', localizacaoController.createLocalizacao);

// 🔹 Buscar localizações com filtros dinâmicos
router.get('/', localizacaoController.getLocalizacoes);

// 🔹 Buscar uma localização por ID
router.get('/:id', localizacaoController.getLocalizacaoById);

// 🔹 Atualizar uma localização
router.put('/:id', localizacaoController.updateLocalizacao);

// 🔹 Deletar uma localização
router.delete('/:id', localizacaoController.deleteLocalizacao);

module.exports = router;
