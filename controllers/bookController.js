const asyncHandler = require('express-async-handler')
const Book = require('../models/Book')
const Author = require('../models/Author')
const Genre = require('../models/Genre')
const BookInstance = require('../models/BookInstance')
const { body, validationResult } = require('express-validator');



exports.index = asyncHandler(async (req, res, next) => {

    const [numBooks, numBookInstances, numAvailable, numAuthors, numGenres] = await Promise.all([
        Book.countDocuments({}).exec(),
        BookInstance.countDocuments({}).exec(),
        BookInstance.countDocuments({ status: 'Available' }).exec(),
        Author.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ])
    console.log(numBooks, numBookInstances, numAvailable, numAuthors, numGenres)

    res.render('index', {
        title: 'Local Library Home',
        book_count: numBooks,
        book_instance_count: numBookInstances,
        book_instance_available_count: numAvailable,
        author_count: numAuthors,
        genre_count: numGenres,
    })

});

// Display list of all books.
exports.book_list = asyncHandler(async (req, res, next) => {
    // res.send('NOT IMPLEMENTED: Book list');
    const allBooks = await Book.find({}, 'title author')
        .sort({ title: 1 })
        .populate('author')
        .exec();

    res.render('book_list', { title: 'Book List', book_list: allBooks });
});
// Display detail page for a specific book.
exports.book_detail = asyncHandler(async (req, res, next) => {
    const [book, bookInstances] = await Promise.all([
        Book.findById(req.params.id)
            .populate('author')
            .populate('genre')
            .exec(),
        BookInstance.find({ book: req.params.id }).exec(),
    ]);
    if (book === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }
    res.render('book_detail', {
        title: 'Book Detail',
        book: book,
        book_instances: bookInstances
    });
});
// Display book create form on GET.
exports.book_create_get = asyncHandler(async (req, res, next) => {
    // res.send('NOT IMPLEMENTED: Book create GET');
    const [allAuthors, allGenres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec(),
    ]);
    res.render('book_form', {
        title: 'Create Book',
        authors: allAuthors,
        genres: allGenres,
    });
});
// 通过 GET 显示创建图书
exports.book_create_post = [
    (req, res, next) => {
        if (!(req.body.genres instanceof Array)) {
            if (typeof req.body.genres === 'undefined') {
                req.body.genres = [];
            } else {
                req.body.genres = new Array(req.body.genres);
            }
        }
        next();
    },
    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('author', 'Author must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('summary', 'Summary must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('isbn', 'ISBN must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('genre.*').escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
        });
        if (!errors.isEmpty()) {
            const allAuthors = await Author.find().exec();
            const allGenres = await Genre.find().exec();
            for (const genre of allGenres) {
                if (book.genre.indexOf(genre._id) > -1) {
                    genre.checked = 'true';
                }
            }
            res.render('book_form', {
                title: 'Create Book',
                authors: allAuthors,
                genres: allGenres,
                book: book,
                errors: errors.array(),
            });
            return;

        }
        await book.save();
        res.redirect(book.url);

    }),
]


// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
    // res.send('NOT IMPLEMENTED: Book delete GET');
    const [book, bookInstances] = await Promise.all([
        Book.findById(req.params.id).populate('author').populate('genre').exec(),
        BookInstance.find({ book: req.params.id }).exec(),
    ]);
    if (book === null) {
        res.redirect('/catalog/books');
    }
    res.render('book_delete', {
        title: 'Delete Book',
        book: book,
        book_instances: bookInstances,
    });
});
// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
    // res.send('NOT IMPLEMENTED: Book delete POST');
    const [book, bookInstances] = await Promise.all([
        Book.findById(req.body.bookid).populate('author').populate('genre').exec(),
        BookInstance.find({ book: req.body.bookid }).exec(),
    ]);
    if (bookInstances.length > 0) {
        res.render('book_delete', {
            title: 'Delete Book',
            book: book,
            book_instances: bookInstances,
        })
        return;
    }
    await Book.findByIdAndDelete(req.body.bookid);
    res.redirect('/catalog/books');
});
// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
    // res.send('NOT IMPLEMENTED: Book update GET');
    const [book, allAuthors, allGenres] = await Promise.all([
        Book.findById(req.params.id).populate('author').populate('genre').exec(),
        Author.find().exec(),
        Genre.find().exec(),
    ]);
    if (book === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }
    for (const genre of allGenres) {
        for (const book_g of book.genre) {
            if (genre._id.toString() === book_g._id.toString()) {
                genre.checked = 'true';
            }
        }
    }
    res.render('book_form', {
        title: 'Update Book',
        authors: allAuthors,
        genres: allGenres,
        book: book,
    })
});
// Handle book update on POST.

exports.book_update_post = [
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },
    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('author', 'Author must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('summary', 'Summary must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('isbn', 'ISBN must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('genre.*').escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
            _id: req.params.id,
        });
        if (!errors.isEmpty()) {
            const allAuthors = await Author.find().exec();
            const allGenres = await Genre.find().exec();
            for (const genre of allGenres) {
                if (book.genre.indexOf(genre._id) > -1) {
                    genre.checked = 'true';
                }
            }
            res.render('book_form', {
                title: 'Update Book',
                authors: allAuthors,
            })
            return;
        }
        const theBook = await Book.findByIdAndUpdate(req.params.id, book, {});
        res.redirect(theBook.url);

    })

];
