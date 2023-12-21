// const Genre = require("../models/genre");

const asyncHandler = require("express-async-handler");
const {
  getGenres,
  getGenreDetail,
  getGenre,
  createGenre,
} = require("../database.js");
const { body, validationResult } = require("express-validator");

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
exports.genre_create_get = (req, res, next) => {
  console.log("genre_create_get");
  res.render("genre_form", {
    title: "Create Genre",
    genre: { name: "" }, // Provide an empty genre object
    errors: [], // Provide an empty errors array
  });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize...
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract validation errors...
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Render the form again with errors...
      res.render("genre_form", {
        title: "Create Genre",
        genre: { name: req.body.name },
        errors: errors.array(),
      });
    } else {
      // Check if Genre exists...
      const genreExists = await getGenre(req.body.name);

      if (genreExists) {
        const url = `/catalog/genre/${genreExists.id}`;

        // Genre exists, redirect...
        res.redirect(url);
      } else {
        // Data from form is valid, create new genre...
        const newGenreId = await createGenre(req.body.name);
        const url = `/catalog/genre/${newGenreId}`;

        // Redirect to new genre's detail page...
        // res.redirect(newGenre.url); // Ensure newGenre.url is available
        res.redirect(url);
      }
    }
  }),
];

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
