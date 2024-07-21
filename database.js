const mysql = require('mysql2/promise');

// Crée une connexion à la base de données
const createConnection = async () => {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
};

module.exports = { createConnection };
