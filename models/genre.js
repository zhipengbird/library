const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

GenreSchema.virtual('url').get(function () {
    return `/catalog/genre/${this._id}`;
});
GenreSchema.virtual('name_lower').get(function () {
    return this.name.toLowerCase();
});

module.exports = mongoose.model('Genre', GenreSchema);
