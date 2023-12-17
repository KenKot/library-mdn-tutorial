const express = require("express");
const router = express.Router();

const { getAuthors } = require("../database.js");

router.get("/", async function (req, res) {
  // res.send("HELLO");
  try {
    const authors = await getAuthors();
    res.send(authors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting authors");
  }
});

// app.get("/notes", async function (req, res) {
//     try {
//       const notes = await getNotes();
//       res.send(notes);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Error getting notes");
//     }
//   });

module.exports = router;
