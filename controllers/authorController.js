// const Author = require("../models/author");
const asyncHandler = require("express-async-handler");
const {
  getAuthors,
  getAuthorDetail,
  getAuthorBooks,
  createAuthor,
} = require("../database.js");

const {body, validationResult} = require("express-validator");

// Display list of all Authors.
exports.author_list = asyncHandler(async (req, res, next) => {
  console.log(".author_list");

  const allAuthors = await getAuthors();
  console.log("allAuthors:", allAuthors);
  // res.send(allAuthors);
  res.render("author_list", {title: "Author List", author_list: allAuthors});
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

  res.render("author_detail", {authorDetail, authorBooks});
});

// Display Author create form on GET.
exports.author_create_get = (req, res, next) => {
  res.render("author_form", {
    title: "Create Author",
    author: {}, // Provide an empty author object
    errors: [], // Provide an empty errors array
  });
};

exports.author_create_post = [
  // Validation and sanitization...
  body("first_name")
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        title: "Create Author",
        author: req.body, // Use the body of the request as the author object for re-rendering
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Save author using your SQL function.
      const newAuthorId = await createAuthor({
        first_name: req.body.first_name,
        family_name: req.body.family_name, // Ensure this matches your SQL table's column
        date_of_birth: req.body.date_of_birth || null,
        date_of_death: req.body.date_of_death || null,
        // Add any other fields your createAuthor function expects
      });


      res.redirect(`/catalog/author/${newAuthorId}`); // Modify as needed based on your URL structure
    }
  }),
];

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
