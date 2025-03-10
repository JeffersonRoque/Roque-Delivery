const express = require('express');
const router = express.Router();
const pessoaFisicaController = require('../controllers/pessoaFisicaController');

router.post('/', pessoaFisicaController.create);
router.get('/', pessoaFisicaController.getAll);
router.get('/:id', pessoaFisicaController.getById);
router.put('/:id', pessoaFisicaController.update);
router.delete('/:id', pessoaFisicaController.delete);

module.exports = router;