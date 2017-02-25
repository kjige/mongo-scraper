var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
    notesBody: String,
    notesDate: {type: Date, default: Date.now}
});

var Notes = mongoose.model('Notes', NotesSchema);

module.exports = Notes;