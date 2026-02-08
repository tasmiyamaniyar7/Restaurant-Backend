require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error("DB Error:", err);
    return;
  }
  console.log("MySQL Connected ✅");
});

// API Route
app.post("/reserve", (req, res) => {

  const { name, email, date, time, guests } = req.body;

  const sql =
    "INSERT INTO reservations (name,email,date,time,guests) VALUES (?,?,?,?,?)";

  db.query(sql, [name, email, date, time, guests], (err, result) => {

    if (err) {
      console.error(err);
      res.status(500).send("DB Error");
      return;
    }

    res.send("Reservation saved");
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

