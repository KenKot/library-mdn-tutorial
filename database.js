const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

async function getAuthors() {
  const [rows] = await pool.query("SELECT * FROM Author");
  return rows;
}

async function getBookCount() {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM Book");
  return rows[0].count;
}

async function getBookInstanceCount() {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM BookInstance");
  return rows[0].count;
}

async function getAvailableBookInstanceCount() {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM BookInstance WHERE status = 'Available'"
  );
  return rows[0].count;
}

async function getAuthorCount() {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM Author");
  return rows[0].count;
}

async function getGenreCount() {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM Genre");
  return rows[0].count;
}

// You can also create an aggregated function to fetch all counts at once
async function getAggregatedCounts() {
  return await Promise.all([
    getBookCount(),
    getBookInstanceCount(),
    getAvailableBookInstanceCount(),
    getAuthorCount(),
    getGenreCount(),
  ]);
}

module.exports = {
  getAuthors,
  getBookCount,
  getBookInstanceCount,
  getAvailableBookInstanceCount,
  getAuthorCount,
  getGenreCount,
  getAggregatedCounts,
};
