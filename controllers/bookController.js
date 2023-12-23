// const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

const {
  getAuthors,
  getGenres,
  createNewBook,
  getAggregatedCounts,
  getAllBooks,
  getBookDetail,
  getBookInstances,
  updateBookById,
} = require("../database.js");

exports.index = asyncHandler(async (req, res, next) => {
  console.log(".index f(x)");

  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await getAggregatedCounts();

  res.render("index", {
    title: "Local Library Home",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
});

// exports.index = asyncHandler(async (req, res, next) => {
// //   res.send("NOT IMPLEMENTED: Site Home Page");
// res.render("index", { title: "Home Page" });
// });

// Display list of all books.
exports.book_list = asyncHandler(async (req, res, next) => {
  console.log(".book_list");

  const allBooks = await getAllBooks();
  console.log("allBooks:", allBooks);
  res.render("book_list", {title: "Book List!", book_list: allBooks});

  // try {
  //   const allBooks = await db.getAllBooks();
  //   console.log("allBooks:", allBooks);
  //   res.render("book_list", { title: "Book List!", book_list: allBooks });
  // } catch (error) {
  //   // Handle the error
  //   next(error);
  // }
});

// Display detail page for a specific book.
exports.book_detail = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
  const [bookDetail] = await getBookDetail(req.params.id);
  const bookInstances = await getBookInstances(req.params.id);

  if (!bookDetail) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  console.log("bookDetail: ", bookDetail);
  console.log("bookInstances: ", bookInstances);
  res.render("book_detail", {
    title: "Book Detail!",
    bookDetail,
    bookInstances,
  });
});

// Display book create form on GET.
exports.book_create_get = asyncHandler(async (req, res) => {
  const allAuthors = await getAuthors();
  const allGenres = await getGenres();

  res.render("book_form", {
    title: "Create New Book",
    book: {},
    authors: allAuthors,
    genres: allGenres,
    errors: [],
  });
});

// Handle book create on POST.
// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.").trim().isLength({min: 1}).escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({min: 1}).escape(),
  body("genre.*").escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const bookParams = {
      title: req.body.title,
      author_id: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const allAuthors = await getAuthors();
      const allGenres = await getGenres();

      // Mark our selected genres as checked.
      for (const genre of allGenres) {
        if (book.genre.includes(genre.id)) {
          genre.checked = "true";
        }
      }
      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: bookParams,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      const newBookId = await createNewBook(bookParams);
      res.redirect(`/catalog/book/${newBookId}`);
    }
  }),
];

// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

// Display book update form on GET.
// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
  // Get book, authors and genres for form.

  const [book] = await getBookDetail(req.params.id);
  const allAuthors = await getAuthors();
  const allGenres = await getGenres();

  console.log("&&&&&&&&&&&&&&&&&");
  console.log("book", book);
  console.log("allAuthors", allAuthors);
  console.log("allGenres", allGenres);
  console.log("&&&&&&&&&&&&&&&&&");

  if (!book) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected genres as checked.
  allGenres.forEach((genre) => {
    if (book.genre_name?.includes(genre.id)) genre.checked = "true";
  });

  res.render("book_form", {
    title: "Update Book",
    authors: allAuthors,
    genres: allGenres,
    book: book,
    errors: [],
  });
});

// Handle book update on POST.
// Handle book update on POST.
exports.book_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.").trim().isLength({min: 1}).escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({min: 1}).escape(),
  body("genre.*").escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    const book = {
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      id: req.params.id, // This is required, or a new ID will be assigned!
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form
      const [allAuthors] = await getAuthors();
      const [allGenres] = await getGenres();

      // Mark our selected genres as checked.
      for (const genre of allGenres) {
        if (book.genre.indexOf(genre.id) > -1) {
          genre.checked = "true";
        }
      }
      res.render("book_form", {
        title: "Update Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      //   const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {});
      // Redirect to book detail page.
      await updateBookById(book);

      console.log("***********", book, "***********");

      res.redirect(`/catalog/book/${book.id}`);
    }
  }),
];
