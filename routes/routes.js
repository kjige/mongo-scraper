var request = require("request");
var cheerio = require("cheerio");
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
            console.log(scrapings);
        });
    });

    app.post("/article/:id", function(req,res){
        
        var id = req.params.id;
        
        console.log(req.body);
        
        var entry = new Article(scrapings[id]);

        entry.save(function(err, doc){
            if(err){console.log(err);}
        });
        
        res.redirect("/saved");
    });

    app.get("/saved", function(req,res){

        Article.find({}, function(err, savedArticles){

            console.log(savedArticles);

            res.render("saved", {articles: savedArticles}); 
        });
    });

    app.get("/notes/:id", function(req,res){

        Article.findOne({ "_id": req.params.id })

        // now, execute our query
        .exec(function(error, doc) {
            
            // Log any errors
            if (error) {console.log(error);}
            
            // Otherwise, send the doc to the browser as a json object
            else {res.send(doc);}
        });
    });

    app.post("/notes/:id", function(req,res){
            
                    Article.findOneAndUpdate({"_id": req.params.id}, 
                        
                        { $push: { 'notes': req.body.notesBody } }, 
                        
                        function(error) {
                        
                        if (error) {console.log(error);} 
                        else {res.send(true);}

                    });
                // }
            // });
    });

    app.put("/saved/remove/:id", function(req,res){

        Article.remove({"_id":req.params.id}, function(err,dbRes){
            
            if (err) { res.send(err); }
            else { res.send(true); }

        });
    });

    app.put("/note/remove/:id/:note", function(req,res){
        console.log("COMMENT "+req.params.note);
        Article.update({"_id":req.params.id}, {$pull: {'notes': {$in: [req.params.note]}}},function(err,dbRes){
            
            if (err) { res.send(err); }
            else { res.send(true); }

        });
    });
}