var mongoose = require('mongoose');

// save a reference to the Schema constructor
var Schema = mongoose.Schema;

// create a new Note schema object
var NoteSchema = new Schema({
    notes: {
        type: String,
        trim: true
    }
});

// create model from the above schema
var Note = mongoose.model('Note', NoteSchema);

// Export the Note model
module.exports = Note;