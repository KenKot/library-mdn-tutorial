// const Author = require("../models/author");
const asyncHandler = require("express-async-handler");
const {
  getAuthors,
  getAuthorDetail,
  getAuthorBooks,
} = require("../database.js");

// Display list of all Authors.
exports.author_list = asyncHandler(async (req, res, next) => {
  console.log(".author_list");

  const allAuthors = await getAuthors();
  console.log("allAuthors:", allAuthors);
  // res.send(allAuthors);
  res.render("author_list", { title: "Author List", author_list: allAuthors });
});

// Display detail page for a specific Author.
exports.author_detail = asyncHandler(async (req, res, next) => {
  console.log(".author_detail:");

  const [authorDetail] = await getAuthorDetail(req.params.id);
  const authorBooks = await getAuthorBooks(req.params.id);

  console.log("authorDetail", authorDetail);
  console.log("authorBooks", authorBooks);

  if (!authorDetail) {
    const err = newError("Author not Found!");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", { authorDetail, authorBooks });
});

// Display Author create form on GET.
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create GET");
});

// Handle Author create on POST.
exports.author_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create POST");
});

// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
});

// Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
});

// Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle Author update on POST.
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});
