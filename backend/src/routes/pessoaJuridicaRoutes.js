const express = require('express');
const router = express.Router();
const pessoaJuridicaController = require('../controllers/pessoaJuridicaController');

router.post('/', pessoaJuridicaController.create);
router.get('/', pessoaJuridicaController.getAll);
router.get('/:id', pessoaJuridicaController.getById);
router.put('/:id', pessoaJuridicaController.update);
router.delete('/:id', pessoaJuridicaController.delete);

module.exports = router;