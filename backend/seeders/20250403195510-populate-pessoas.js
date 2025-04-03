const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const pessoas = [];
    const pessoasFisicas = [];
    const funcionarios = [];
    const motoristas = [];

    // 🔹 Função para gerar placa
    const gerarPlaca = () => {
      const letras = faker.string.alpha({ length: 3, casing: 'upper' });
      const numeros = faker.number.int({ min: 1000, max: 9999 });
      return `${letras}-${numeros}`;
    };

    // 🔹 Criando a única Pessoa Jurídica antes do loop
    const idPessoaJuridica = uuidv4();
    const pessoaJuridica = {
      id: idPessoaJuridica,
      tipo_pessoa: 'juridica',
      nome: faker.company.name(),
      email: faker.internet.email(),
      senha_hash: await bcrypt.hash(faker.internet.password(), 10),
      telefone: faker.phone.number().substring(0, 20),
      endereco: faker.location.streetAddress(),
      criado_em: new Date(),
      modificado_em: new Date(),
    };
    const pessoaJuridicaInfo = {
      id: idPessoaJuridica,
      cnpj: faker.string.numeric(14), // Substituindo `faker.br.cnpj()`
      razao_social: pessoaJuridica.nome,
      inscricao_estadual: faker.string.alphanumeric(12),
    };

    pessoas.push(pessoaJuridica);
    await queryInterface.bulkInsert('pessoas', [pessoaJuridica]);
    await queryInterface.bulkInsert('pessoa_juridica', [pessoaJuridicaInfo]);

    // 🔹 Criando 50 pessoas físicas (algumas serão funcionários e motoristas)
    for (let i = 0; i < 50; i++) {
      const idPessoaFisica = uuidv4();
      const senhaHash = await bcrypt.hash(faker.internet.password(), 10); // Hash da senha

      pessoas.push({
        id: idPessoaFisica,
        tipo_pessoa: 'fisica',
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        senha_hash: senhaHash,
        telefone: faker.phone.number().substring(0, 20),
        endereco: faker.location.streetAddress(),
        criado_em: new Date(),
        modificado_em: new Date(),
      });

      pessoasFisicas.push({
        id: idPessoaFisica,
        cpf_hash: faker.string.numeric(11), // Substituindo `faker.br.cpf()`
        data_nascimento: faker.date.past({ years: 30, refDate: new Date('2000-01-01') }),
      });

      if (Math.random() > 0.7) { // 🔹 30% das pessoas físicas serão funcionários
        funcionarios.push({
          id: idPessoaFisica,
          cargo: faker.person.jobTitle(),
          empregador_id: idPessoaJuridica, // 🔹 Referenciando a única pessoa jurídica
        });

        if (Math.random() > 0.5) { // 🔹 50% dos funcionários serão motoristas
          motoristas.push({
            id: idPessoaFisica,      
            tipo_veiculo: faker.vehicle.type(),
            placa_veiculo: gerarPlaca(),
          });
        }
      }
    }

    await queryInterface.bulkInsert('pessoas', pessoas);
    await queryInterface.bulkInsert('pessoa_fisica', pessoasFisicas);
    await queryInterface.bulkInsert('funcionarios', funcionarios);
    await queryInterface.bulkInsert('motoristas', motoristas);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('motoristas', null, {});
    await queryInterface.bulkDelete('funcionarios', null, {});
    await queryInterface.bulkDelete('pessoa_fisica', null, {});
    await queryInterface.bulkDelete('pessoa_juridica', null, {});
    await queryInterface.bulkDelete('pessoas', null, {});
  },
};
