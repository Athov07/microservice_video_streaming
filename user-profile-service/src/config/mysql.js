const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
});

module.exports = pool;

pool.getConnection()
  .then(() => console.log("MySQL Connected"))
  .catch(err => {
    console.error("MySQL Connection Failed:", err);
    process.exit(1);
  });