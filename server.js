const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

// Only load dotenv locally (safe)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.use(cors());
app.use(bodyParser.json());


// DEBUG: Check env variables (IMPORTANT)
console.log("DB HOST:", process.env.MYSQLHOST);
console.log("DB USER:", process.env.MYSQLUSER);
console.log("DB NAME:", process.env.MYSQLDATABASE);
console.log("DB PORT:", process.env.MYSQLPORT);


// Database connection
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  connectTimeout: 10000, // prevent timeout issues
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Error:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});


// API Route
app.post("/reserve", (req, res) => {

  const { name, email, date, time, guests } = req.body;

  const sql = `
    INSERT INTO reservations (name,email,date,time,guests)
    VALUES (?,?,?,?,?)
  `;

  db.query(sql, [name, email, date, time, guests], (err) => {

    if (err) {
      console.error("❌ Insert Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ success: true });
  });
});


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});

