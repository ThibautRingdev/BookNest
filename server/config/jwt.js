require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-par-defaut-changez-moi';

module.exports = { JWT_SECRET };

