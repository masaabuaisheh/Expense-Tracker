const express = require("express");
const cors = require("cors");

const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = 3000;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());

// Returns all expenses
app.get("/api/expenses", async (req, res) => {
  const result = await pool.query(`
  SELECT
    id,
    title,
    amount::float8 AS amount,
    category,
    to_char(date, 'YYYY-MM-DD') AS date
  FROM expenses
`);
  res.json(result.rows);
});

// Returns one expense
app.get("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  const result = await pool.query(
    `SELECT
     id,
     title,
     amount::float8 AS amount,
     category,
     to_char(date, 'YYYY-MM-DD') AS date
   FROM expenses
   WHERE id = $1`,
    [id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  res.json(result.rows[0]);
});

// Adds a new expense
app.post("/api/expenses", async (req, res) => {
  const { title, amount, category, date } = req.body;

  // Check required fields
  if (!title || amount == null || !category || !date) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Check amount
  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({
      message: "Amount must be a number greater than zero",
    });
  }

  // Check category
  const categories = ["Food", "Transport", "Bills", "Entertainment", "Other"];

  if (!categories.includes(category)) {
    return res.status(400).json({
      message: "Invalid category",
    });
  }

  const result = await pool.query(
    `INSERT INTO expenses(title, amount, category, date)
     VALUES($1, $2, $3, $4)
     RETURNING 
       id,
       title,
       amount::float8 AS amount,
       category,
       to_char(date, 'YYYY-MM-DD') AS date`,
    [title, amount, category, date],
  );

  res.status(201).json(result.rows[0]);
});

// Updates an expense
app.put("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);

  const { title, amount, category, date } = req.body;

  if (isNaN(id)) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  // Check required fields
  if (!title || amount == null || !category || !date) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Check amount
  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({
      message: "Amount must be a number greater than zero",
    });
  }

  // Check category
  const categories = ["Food", "Transport", "Bills", "Entertainment", "Other"];

  if (!categories.includes(category)) {
    return res.status(400).json({
      message: "Invalid category",
    });
  }

  const result = await pool.query(
    `UPDATE expenses
     SET title = $1,
         amount = $2,
         category = $3,
         date = $4
     WHERE id = $5
     RETURNING
       id,
       title,
       amount::float8 AS amount,
       category,
       to_char(date, 'YYYY-MM-DD') AS date`,
    [title, amount, category, date, id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  res.json(result.rows[0]);
});

// Deletes an expense
app.delete("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  const result = await pool.query(
    `DELETE FROM expenses Where id = $1
     RETURNING
       id,
       title,
       amount::float8 AS amount,
       category,
       to_char(date, 'YYYY-MM-DD') AS date`,
    [id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  res.json(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
