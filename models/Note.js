var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    noteBody: String
    // noteDate: {type: Date, default: Date.now}
});

var Note = mongoose.model('Notes', NoteSchema);

module.exports = Note;