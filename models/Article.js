var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {type: String, required: true},
    link: {type: String, required: true},
    saved: {Boolean, default: false},
    notes:[{type: Schema.Types.ObjectId, ref: 'Notes'}]
});


var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;