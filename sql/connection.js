const sql = require("mssql");

const dbSettings = {
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  server: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "SISTEMA_TESIS",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getConnection,
};
