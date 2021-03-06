var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var Article = require("../models/Article.js");
var Note = require("../models/Note.js");

module.exports = function(app) {
    
    // var to store scrapings
    var scrapings = [];
    
    // scrape ycombinator
    app.get("/", function(req, res) {
        
        // First, we grab the body of the html with request
        request("http://news.ycombinator.com/", function(error, response, html) {

            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);

            // Now, we grab every td with class title
            $(".title").each(function(i, element) {

                // Save an empty result object
                var result = {};

                // Add the title and href of every link, and save them as properties of the result object
                result.id;
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");

                // Add to scrapings array
                scrapings.push(result);

            });

            // remove empty objects in scrapings
            scrapings.map(function(elem){

                if (!elem.title || !elem.link) {

                    scrapings.splice(scrapings.indexOf(elem), 1);

                }
            });

            // assign id after removing blank objects
            scrapings.map(function(elem){

                elem.id = scrapings.indexOf(elem);

            });

            // render result to DOM
            res.render("scrapings", {articles: scrapings});

        });
    });

    // route for saving an article
    app.post("/article/:id", function(req,res){
        
        var id = req.params.id;
        
        var entry = scrapings[id];

        // Article.create(entry, function (err) {
        //     if (err) {console.log(err);}
        // });

        Article.findOneAndUpdate({title: entry.title}, entry, {upsert:true}, function(err, doc) {
            if (err) { console.log(err); }
        });
        
        res.redirect("/saved");
    });

    // route to get all previously saved articles
    app.get("/saved", function(req,res){

        Article.find({}, function(err, savedArticles){

            res.render("saved", {articles: savedArticles}); 
        });
    });

    // get previously saved notes for specific saved article
    app.get("/notes/:id", function(req,res){

        Article.find({ "_id": req.params.id })

        .populate("notes")

        .exec(function(error, doc) {

            if (error) {console.log(error);}
            
            else {res.send(doc);}
        });
    });

    // route to save new note for a specific saved article
    app.post("/notes/:id", function(req,res){

        Note.create({noteBody: req.body.notesBody}, function(error, note){

            if(error) {console.log(error);}
            
            else { Article.findOneAndUpdate({_id: req.params.id}, { $push: { 'notes': note._id } }, { new: true }, function(err) {

                    if(err) {console.log(err);}
                    
                    else {res.send(true);}
                });
            }
        });
    });

    app.put("/saved/remove/:id", function(req,res){

        Article.remove({"_id":req.params.id}, function(err,dbRes){
            
            if (err) { res.send(err); }

            else { res.send(true); }

        });
    });

    app.put("/note/remove/:id/:noteId", function(req,res){
        console.log("COMMENT "+req.params.noteId);

        Note.remove({ _id: req.params.noteId }, function(error, note) {
            
            if (error) {res.send(error);} 
            
            else {res.send(true);}
        });
    });
}