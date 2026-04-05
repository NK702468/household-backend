const mysql = require("mysql2");

const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("DB接続失敗", err);
    return;
  }
  console.log("DB接続成功");
  connection.release();
});

module.exports = db;