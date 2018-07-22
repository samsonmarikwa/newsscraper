var mongoose = require('mongoose');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// create a new Article schema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    summary: {
        type: String,
        trim: true
    },
    link: {
        type: String,
        trim: true
    }
});

// create model from the above schema using mongoose's model method
var Article = mongoose.model('Article', ArticleSchema);

// Export the Article model
module.exports = Article;