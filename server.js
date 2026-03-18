const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

db.query("SET SQL_SAFE_UPDATES = 0");

app.get("/transactions", (req, res) => {
    const { month } = req.body;

    const sql = `
        SELECT * FROM transactions WHERE month = ?
    `;

    db.query(sql, [month], (err, result) => {
        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    })
});

app.get("/budget/:month", (req, res) => {
    const { month } = req.params;

    const sql = `
        SELECT * FROM budgets WHERE month = ? 
    `;

    db.query(sql, [month], (err, result) => {
        if(err){
            return res.status(500).json(err);
        }

        if(result.length === 0){
           return res.json({amount: 0})
        }

        res.json(result[0]);
    })
})

app.post("/budget", (req, res) => {
    const { month, amount } = req.body;

    const updateSql = `
        UPDATE budgets SET amount = ? WHERE month = ?
    `;

    db.query(updateSql, [amount, month], (err, result) => {
        if(err){
            return res.status(500).json(err);
        }

        if(result.affectedRows === 0){
            const insertSQL = `
                INSERT INTO budgets (month, amount) VALUES (?,?)
            `;

            db.query(insertSQL, [month, amount], (err) => {
                if(err){
                    return res.status(500).json(err);
                }
            })
        }
        res.json({month, amount});
    })
})

app.post("/transactions", (req, res) => {
    const {amount, category, checked, type, month} = req.body;

    const sql =`
        INSERT INTO transactions (amount, category, checked, type, month)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [amount, category, checked, type, month], (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send("DBエラー");
            return;
        }

        res.json({
            id: result.insertId,
            amount,
            category,
            checked,
            type,
            month
        })
    })
});

app.patch("/transactions/:id", (req, res) => {
    
    const id = Number(req.params.id);

    const updateSql = `
        UPDATE transactions SET checked = NOT checked WHERE id = ?
    `;

    db.query(updateSql, [id], (err) => {
        if(err){
            return res.status(500).json(err);
        }

        db.query(
            "SELECT * FROM transactions WHERE id = ?",
            [id],
            (err, results) => {
                if(err){
                    res.status(500).json(err);
                }

               return res.json(results[0]);
            }
        )
    })

    
})

app.delete("/transactions", (req, res) => {
    const sql = `
        DELETE FROM transactions WHERE checked = 1
    `;

    db.query(sql, (err) => {
        if(err){
            return res.status(500).json(err);
        }

        db.query(
            "SELECT * FROM transactions",
            (err, result) => {
                if(err){
                    res.status(500).json(err);
                }

                res.json(result);
            }
        )
    })
})

app.listen(PORT, () => {
    console.log("サーバー起動");
})