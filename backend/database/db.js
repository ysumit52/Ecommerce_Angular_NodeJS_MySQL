const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  console.log("DB" + process.env.DB_NAME);
  if (err) console.log(err);
  else console.log("MySQL is connected...");
});

module.exports = connection;
