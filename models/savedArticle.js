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
    },
    notes: [{
        // store notes id n the array
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// create model from the above schema using mongoose's model method
var SavedArticle = mongoose.model('SavedArticle', ArticleSchema);

// Export the Article model
module.exports = SavedArticle;