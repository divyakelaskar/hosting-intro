const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("🚫 Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL!");
        connection.release();
    }
});

// Routes
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

const SELF_PING_INTERVAL = 14 * 60 * 1000;
const SERVER_URL = process.env.SERVER_URL;

if (SERVER_URL) {
    setInterval(() => {
        axios.get(`${SERVER_URL}/items`)
            .then(() => console.log("✅ Self-ping successful"))
            .catch(err => console.error("🚫 Self-ping failed:", err.message));
    }, SELF_PING_INTERVAL);
} else {
    console.warn("⚠️ SERVER_URL is not defined in .env. Self-ping disabled.");
}

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
