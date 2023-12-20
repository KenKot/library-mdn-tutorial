// const Book = require("../models/book");
const asyncHandler = require("express-async-handler");

const {
  getBookDetail,
  getAggregatedCounts,
  getAllBooks,
  getBookInstances,
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
  res.render("book_list", { title: "Book List!", book_list: allBooks });

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
exports.book_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create GET");
});

// Handle book create on POST.
exports.book_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create POST");
});

// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

// Handle book update on POST.
exports.book_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
