const mysql = require("mysql2");

const db = mysql.createConnection(process.env.DATABASE_URL)

db.connect((err) => {
    if(err) {
        console.log("DB接続失敗", err);
        return;
    }
    console.log("DB接続成功");
});

module.exports = db;