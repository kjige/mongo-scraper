var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

var app = express();

var databaseUrl = "news";
var collections = ["googlenews"];
var db = mongojs(databaseUrl,collections);

db.on("error", function(error){
    console.log("Database Error: ", error);
});

