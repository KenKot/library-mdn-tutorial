// const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
// const db = require("../database.js");
const { getGenres, getGenreDetail } = require("../database.js");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const genres = await getGenres();
  console.log("genre_list", genres);
  res.render("genre_list", { title: "Genre List", genres });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // console.log("genre_detail");
  // res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
  const genreDetail = await getGenreDetail(req.params.id);

  if (!genreDetail || genreDetail.length === 0) {
    // Handle the case where the genre is not found
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  const genreTitle = genreDetail[0].genre_name;
  console.log("genreDetail:", genreDetail);
  res.render("genre_detail", {
    title: "Genre Detail",
    genreTitle,
    genre_books: genreDetail,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
});

// Handle Genre create on POST.
exports.genre_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
});

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
