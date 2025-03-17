const express = require('express');
const localizacaoController = require('../controllers/localizacaoController');

const router = express.Router();

// 🔹 Criar uma nova localização
router.post('/', localizacaoController.createLocalizacao);

// 🔹 Buscar todas as localizações
router.get('/', localizacaoController.getAllLocalizacoes);

// 🔹 Buscar uma localização por ID
router.get('/:id', localizacaoController.getLocalizacaoById);

// 🔹 Buscar todas as localizações de uma pessoa específica
router.get('/pessoa/:pessoa_id', localizacaoController.getLocalizacoesByPessoa);

// 🔹 Buscar todas as localizações de um motorista específico
router.get('/motorista/:motorista_id', localizacaoController.getLocalizacoesByMotorista);

// 🔹 Atualizar uma localização
router.put('/:id', localizacaoController.updateLocalizacao);

// 🔹 Deletar uma localização
router.delete('/:id', localizacaoController.deleteLocalizacao);

module.exports = router;
