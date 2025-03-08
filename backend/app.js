const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to MySQL!");
});

// CRUD API
app.get("/items", (req, res) => {
    db.query("SELECT * FROM items", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post("/items", (req, res) => {
    const { name, value } = req.body;
    db.query("INSERT INTO items (name, value) VALUES (?, ?)", [name, value], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, name, value });
    });
});

app.put("/items/:id", (req, res) => {
    const { name, value } = req.body;
    const { id } = req.params;
    db.query("UPDATE items SET name = ?, value = ? WHERE id = ?", [name, value, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ id, name, value });
    });
});

app.delete("/items/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM items WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Item deleted" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));