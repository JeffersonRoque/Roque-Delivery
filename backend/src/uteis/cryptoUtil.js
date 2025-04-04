// utils/cryptoUtil.js
const crypto = require('crypto');

const secret = process.env.CRYPTO_SECRET || 'sua_chave_secreta_segura';

function hashValue(value) {
  return crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('hex');
}

module.exports = { hashValue };
