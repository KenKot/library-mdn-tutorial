const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

async function getAuthors() {
  const [rows] = await pool.query("SELECT * FROM Author");
  return rows;
}

// async function getNote(id) {
//   const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
//   return rows[0];
// }

// async function createNote(title, contents) {
//   const [result] = await pool.query(
//     "INSERT INTO notes (title, contents) VALUES (?, ?)",
//     [title, contents]
//   );
//   const id = result.insertId;
//   return getNote(id);
// }

module.exports = { getAuthors };
