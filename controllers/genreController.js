const Genre = require('../models/Genre');
const asyncHandler = require('express-async-handler');
const async = require('async')
const Book = require('../models/Book');
const { body, validationResult } = require('express-validator');

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
    const list = await Genre.find().sort({ name: 1 }).exec();
    res.render('genre_list', { title: 'Genre List', genre_list: list });

});
// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, genreBooks] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }).populate('author').exec(),
    ]);
    if (genre === null) {
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
    }
    res.render('genre_detail', {
        title: 'Genre Detail',
        genre: genre,
        genre_books: genreBooks,
    });
    // res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
});
// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
    res.render('genre_form', { title: 'Create Genre' });
    // res.send('NOT IMPLEMENTED: Genre create GET');
});
// Handle Genre create on POST.
exports.genre_create_post = [
    body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre({ name: req.body.name });
        if (!errors.isEmpty()) {
            res.render('genre_form', {
                title: 'Create Genre',
                genre: genre,
                errors: errors.array(),
            });
            return;
        } else {
            const genreExists = await Genre.findOne({ name: req.body.name }).exec();
            if (genreExists) {
                res.redirect(genreExists.url);
            } else {
                await genre.save();
                res.redirect(genre.url);
            }
        }
    }),
];
// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre delete GET');
});
// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre delete POST');
});
// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre update GET');
});

