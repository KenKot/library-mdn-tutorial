// const BookInstance = require("../models/bookinstance");
const asyncHandler = require("express-async-handler");
const {
  getAllBookInstances,
  getBookinstanceDetail,
  getAllBooks,
  createBookInstance,
} = require("../database.js"); // path to you

const {body, validationResult} = require("express-validator");

const {DateTime} = require("luxon");

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  console.log(".bookinstance_list");
  // const allBookInstances = await db.getAllBookInstances();
  const allBookInstances = await getAllBookInstances();
  console.log("allBookInstances:", allBookInstances);
  allBookInstances.forEach((bookInstance) => {
    bookInstance.due_back_formatted = DateTime.fromJSDate(
      bookInstance.due_back
    ).toLocaleString(DateTime.DATE_MED);
  });

  console.log("allBookInstances:", allBookInstances);
  res.render("bookinstance_list", {
    title: "Book Instance List",
    bookinstance_list: allBookInstances,
  });
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  console.log("bookinstance_detail");

  const [bookinstance] = await getBookinstanceDetail(req.params.id);
  console.log("instanceDetails", bookinstance);

  res.render("bookinstance_detail", {
    title: "bookinstance_detail",
    bookinstance,
  });
});

// Display BookInstance create form on GET.
// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await getAllBooks();

  console.log("allBooks:", allBooks);

  res.render("bookinstance_form", {
    title: "Create Book Instance",
    book_list: allBooks, // Pass the array of book objects
    bookinstance: {}, // Empty object for the form to fill out
    selected_book: {},
    errors: [], // Initialize errors as an empty array
  });
});

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  // Validate and sanitize fields.
  body("book", "Book must be specified").trim().isLength({min: 1}).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({values: "true"})
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = {
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    };

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allBooks = await getAllBooks();

      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book: bookInstance.book_id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    } else {
      // Data from form is valid
      const newInstanceId = await createBookInstance(bookInstance);
      // console.log("newInstanceId from controller", newInstanceId);
      res.redirect(`/catalog/bookinstance/${newInstanceId}`);
    }
  }),
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
});

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});
