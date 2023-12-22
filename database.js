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

async function getAllBooks() {
  try {
    const query = `
      SELECT Book.title, Author.name AS author_name, Book.url, Book.id
      FROM Book
      INNER JOIN Author ON Book.author_id = Author.id
      ORDER BY Book.title;
    `;
    const [books] = await pool.query(query);
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

async function getAllBookInstances() {
  try {
    // const query = `
    //   SELECT * FROM BookInstance
    //   INNER JOIN Book ON Book.id = BookInstance.book_id
    //   INNER JOIN Author ON Author.id = Book.author_id;
    // `;

    const query = `
    SELECT BookInstance.id, BookInstance.url, Book.title, 
    BookInstance.status, BookInstance.imprint, 
    BookInstance.status, BookInstance.due_back 
    FROM BookInstance INNER JOIN Book ON Book.id = BookInstance.book_id 
    INNER JOIN Author ON Author.id = Book.author_id;

    `;
    const [books] = await pool.query(query);
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

async function getAuthors() {
  try {
    const query = `
      SELECT * FROM Author;
    `;
    const [authors] = await pool.query(query);
    return authors;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

async function getGenres() {
  try {
    const query = `SELECT name, url, id FROM Genre ORDER BY name;`;
    const [genres] = await pool.query(query);

    return genres;
  } catch (error) {
    console.log("Error fetching genres:", error);
    throw error;
  }
}

async function getGenreDetail(id) {
  try {
    const query = `
      SELECT 
        g.id AS genre_id,
        g.name AS genre_name,
        g.url AS genre_url,
        b.id AS book_id,
        b.title AS book_title,
        b.summary AS book_summary
      FROM 
        Genre g
      LEFT JOIN 
        Book_Genre bg ON g.id = bg.genre_id
      LEFT JOIN 
        Book b ON bg.book_id = b.id
      WHERE 
        g.id = ?;
    `;
    const [genreDetail] = await pool.query(query, [id]);
    return genreDetail;
  } catch (error) {
    console.log("getGenreDetail error:", error);
    throw error;
  }
}

async function getBookDetail(bookId) {
  try {
    const bookDetailQuery = `
    SELECT 
    b.id, b.title, b.summary, b.ISBN, b.url,
    a.id AS author_id, a.first_name, a.family_name, a.name AS author_name, a.lifespan, a.url AS author_url,
    g.name AS genre_name
    FROM 
    Book b
    INNER JOIN 
    Author a ON b.author_id = a.id
    LEFT JOIN 
    Book_Genre bg ON b.id = bg.book_id
    LEFT JOIN 
    Genre g ON bg.genre_id = g.id
    WHERE 
    b.id = ?;
  
    `;

    const [bookDetail] = await pool.query(bookDetailQuery, [bookId]);

    return bookDetail;
  } catch (error) {
    console.log("getBookDetail error: ", error);
    throw error;
  }
}

async function getBookInstances(bookId) {
  try {
    const bookInstancesQuery = `
      SELECT bi.imprint, bi.status, bi.due_back, bi.id
      FROM BookInstance bi
      WHERE bi.book_id = ?
    `;

    const [bookInstances] = await pool.query(bookInstancesQuery, [bookId]);

    return bookInstances;
  } catch (error) {
    console.log("getBookDetail error: ", error);
    throw error;
  }
}

async function getAuthorDetail(authorId) {
  try {
    const query = `
    SELECT * FROM Author a
    WHERE id = ?;
    `;

    const [authorDetail] = await pool.query(query, [authorId]);
    return authorDetail;
  } catch (error) {
    console.log("getAuthorDetail error :", error);
    throw error;
  }
}

async function getAuthorBooks(authorId) {
  try {
    const query = `
    SELECT * 
    FROM Book b
    WHERE author_id = ?;
    `;

    const [authorBooks] = await pool.query(query, [authorId]);
    return authorBooks;
  } catch (error) {
    console.log("getAuthorBooks error :", error);
    throw error;
  }
}

async function getBookinstanceDetail(instanceId) {
  try {
    const query = `
    SELECT b.id AS book_id, b.title, bi.imprint, bi.status, bi.due_back, bi.id 
    FROM BookInstance bi
    INNER JOIN Book b
    ON bi.book_id = b.id
    WHERE bi.id = ?;
    `;

    const [instanceDetail] = await pool.query(query, [instanceId]);
    return instanceDetail;
  } catch (error) {
    console.log("getBookinstanceDetail errored: ", error);
    throw error;
  }
}

async function getGenre(name) {
  try {
    const query = `SELECT * FROM Genre WHERE name = ?`;
    const [genres] = await pool.query(query, [name]);
    return genres.length > 0 ? genres[0] : null;
  } catch (error) {
    console.error("getGenre error:", error);
    throw error;
  }
}

async function createGenre(name) {
  try {
    const genreUrl = `/genre/${encodeURIComponent(name)}`;
    const insertQuery = `INSERT INTO Genre (name, url) VALUES (?, ?)`;

    const [insertResult] = await pool.query(insertQuery, [name, genreUrl]);

    return insertResult.insertId;
  } catch (error) {
    console.error("createGenre error:", error);
    throw error;
  }
}

async function createAuthor(authorObj) {
  try {
    const name = authorObj.first_name + " " + authorObj.family_name;
    const birthYear = new Date(authorObj.date_of_birth).getFullYear();
    const lifespan = `${birthYear || "Unknown"}-present`;
    const url = `/authors/${encodeURIComponent(
      authorObj.first_name
    )}-${encodeURIComponent(authorObj.family_name)}`;

    const query = `
      INSERT INTO Author(first_name, family_name, date_of_birth, date_of_death, name, lifespan, url)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      authorObj.first_name,
      authorObj.family_name,
      authorObj.date_of_birth,
      authorObj.date_of_death || null,
      name,
      lifespan,
      url,
    ];

    const [newAuthor] = await pool.query(query, params);
    console.log("newAuthor insert id:", newAuthor.insertId);
    console.log("newAuthor insert id:", newAuthor);
    return newAuthor.insertId;
  } catch (error) {
    console.error("Error inserting author:", error);
    throw error;
  }
}

async function createNewBook(bookParams) {
  console.log("DB params:");
  try {
    const url = `/books/${encodeURIComponent(bookParams.title)}`;
    const newBookQuery = `INSERT INTO Book(title, author_id, summary, ISBN, url) VALUES(?, ?, ?, ?, ?)`;

    const newBookParams = [
      bookParams.title,
      bookParams.author_id,
      bookParams.summary,
      bookParams.isbn,
      url,
    ];

    bookParams.url = url;
    const [newBook] = await pool.query(newBookQuery, newBookParams);
    const newBookId = newBook.insertId;

    const updateBookGenreTableQuery = `INSERT INTO Book_Genre(book_id, genre_id) VALUES(?, ?)`;
    pool.query(updateBookGenreTableQuery, [newBookId, bookParams.genre]);
    return newBookId;
  } catch (error) {
    console.log("create new book error", error);
    throw error;
  }
}

module.exports = {
  getAuthors,
  getBookCount,
  getBookInstanceCount,
  getAvailableBookInstanceCount,
  getAuthorCount,
  getGenreCount,
  getAggregatedCounts,
  getAllBooks,
  getAllBookInstances,
  getAuthors,
  getGenres,
  getGenreDetail,
  getBookDetail,
  getBookInstances,
  getAuthorDetail,
  getAuthorBooks,
  getBookinstanceDetail,
  getGenre,
  createGenre,
  createAuthor,
  createNewBook,
};
