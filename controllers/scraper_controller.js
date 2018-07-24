var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// scrapping tools
// Axios is a promise-based http library, similar to JQuery's Ajax method
// It works on the client and server
var axios = require('axios');
var cheerio = require('cheerio');

// require all models
var db = require('../models');

var MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost/scraper';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// retrieve news articles from database
router.get('/', (req, res) => {
    db.Article.find({})
        .then((article) => {
            console.log("Retrived news articles");
            console.log(article);
            if (article.length > 0) {
                res.render("index", {
                    article: article
                });
            }

            if (article.length < 1) {
                res.render("noarticles", {
                    msg1: "Uh Oh. Looks like we don't have any new articles",
                    msg2: "What Would You Like To Do?",
                    msg3: "Try Scraping New Articles",
                    msg4: "Go to Saved Articles"
                });
            }
        });


});


//scrape articles
router.get('/api/scrape', (req, res) => {

    axios.get('https://www.charlotteobserver.com/news/').then((response) => {

        var $ = cheerio.load(response.data);


        $('article').each((i, element) => {

            // create an empty result object
            var result = {};

            //var category = $(element).find('h2.kicker').text();
            var title = $(element).find('h4.title').text();
            var summary = $(element).find('p.summary ').text();
            var link = $(element).find('h4.title').find('a').attr('href');

            if (title !== '' && title != null) {
                result.title = title;
                result.summary = summary;
                result.link = link;
            }

            db.Article.create(result).then((dbArticle) => {
                // console log the record written
                console.log(dbArticle);
            }).catch((err) => {
                res.json({
                    success: false,
                    swalTitle: "Article Not Created",
                    swalMsg: "Failed to create articles",
                    swalIcon: "error"
                });

            });
        });
        res.json({
            success: true,
            swalTitle: "Article Created",
            swalMsg: "News Articles created",
            swalIcon: "success"
        });
    });
});


// clear news article from database

router.delete("/api/cleararticles", (req, res) => {
    console.log("Deleting articles");
    db.Article.deleteMany({})
        .then((article) => {
            console.log("Deleted articles ", article.ok);
            if (article.ok == 1) {
                res.json({
                    success: true,
                    swalTitle: "Articles Cleared",
                    swalMsg: article.n + " articles cleared!!!",
                    swalIcon: "success"
                });
            } else {
                res.json({
                    success: false,
                    swalTitle: "Articles Not Cleared",
                    swalMsg: "Failed to clear articles",
                    swalIcon: "error"
                });
            }
        }).catch((error) => {
            console.log(error);
            res.json({
                success: false,
                swalTitle: "Error",
                swalMsg: "Failure to clear news articles!!!",
                swalIcon: "error"
            });
        });
});


// save news articles to saved articles

router.post("/api/savearticle", (req, res) => {
    console.log("Saving articles");
    // create an empty result object
    var result = {};

    result = req.body;

    db.SavedArticle.create(result).then((dbSavedArticle) => {
        // console log the record written
        console.log(dbSavedArticle);
    }).catch((err) => {
        res.json({
            success: false,
            swalTitle: "Article Not Saved",
            swalMsg: "Failed to save article",
            swalIcon: "error"
        });

    });
    res.json({
        success: true,
        swalTitle: "Article Saved",
        swalMsg: "News Articles Saved",
        swalIcon: "success"
    });
});


// retrieve news articles from saved article database
router.get('/api/retrieve-saved', (req, res) => {
    console.log("Retrieving Saved articles");
    db.SavedArticle.find({})
        .then((article) => {
            console.log("Retrived saved news articles");
            console.log(article);
            if (article.length > 0) {
                res.render("saved", {
                    article: article
                });
            }

            if (article.length < 1) {
                res.render("nosavedarticles", {
                    msg1: "Uh Oh. Looks like we don't have any saved articles",
                    msg2: "Would You Like To Browse Available Articles?",
                    msg3: "Browse Articles"
                });
            }
        });
});


// delete saved artcles


// retrieve article notes

// save article notes 

// delete article notes

// modify article notes

module.exports = router;