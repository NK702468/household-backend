const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "NK702468.MySQL",
    database: "household_app"
})

db.connect((err) => {
    if(err) {
        console.log("DB接続失敗", err);
        return;
    }
    console.log("DB接続成功");
});

module.exports = db;