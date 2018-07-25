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

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scraper';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// retrieve news articles from database
// displays the index.handlebars or noarticles.handlebars views
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


// retrieve news articles from saved article database
// switches the view to the saved.handlebars / nosaved.handlebars
router.get('/saved', (req, res) => {
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
                res.render("nosaved", {
                    msg1: "Uh Oh. Looks like we don't have any saved articles",
                    msg2: "Would You Like To Browse Available Articles?",
                    msg3: "Browse Articles"
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

            if (title !== '' && title != null && summary !== '' && summary != null) {
                result.title = title;
                result.summary = summary;
                result.link = link;

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
            }
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


// delete news articles from Articles collection
router.delete("/api/deletearticle", (req, res) => {
    console.log("Deleting articles");

    var id = req.body.id;

    db.Article.deleteOne({ _id: id }).then((result) => {
        console.log(result);
        if (result.n < 1) {
            res.json({
                success: false,
                swalTitle: "Articles Collection",
                swalMsg: "Failed to remove article from Article Collection",
                swalIcon: "error"
            });
        } else {

            res.json({
                success: true,
                swalTitle: "Articles Collection",
                swalMsg: "News Article Removed From Article Collection",
                swalIcon: "success"
            });
        }
    });
});


// delete saved articles from the SavedArticle collection
router.delete("/api/deletesaved", (req, res) => {
    console.log("Deleting saved articles");

    var id = req.body.id;

    db.SavedArticle.deleteOne({ _id: id }).then((result) => {
        console.log(result);
        if (result.n < 1) {
            res.json({
                success: false,
                swalTitle: "Saved Articles Collection",
                swalMsg: "Failed to remove article from SavedArticle Collection",
                swalIcon: "error"
            });
        } else {

            res.json({
                success: true,
                swalTitle: "Saved Articles Collection",
                swalMsg: "News Article Removed From SavedArticle Collection",
                swalIcon: "success"
            });
        }
    });
});


// save article notes
router.post("/api/save-notes", (req, res) => {
    console.log("Saving notes");

    var note = {
        notes: req.body.notes
    }

    db.Note.create(note).then((dbNote) => {
        //save a note's id into a SavedArticle
        return db.SavedArticle.findOneAndUpdate({ _id: req.body.articleId }, { $push: { notes: dbNote._id } }, { new: true });
    }).then((dbSavedArticle) => {
        if (dbSavedArticle.n < 1) {
            res.json({
                success: false,
                swalTitle: "Saved Articles Collection",
                swalMsg: "Failed to create notes for the saved article in SavedArticle Collection",
                swalIcon: "error"
            });
        } else {

            res.json({
                success: true,
                swalTitle: "Saved Articles Collection",
                swalMsg: "Note created for the article in the SavedArticle Collection",
                swalIcon: "success"
            });
        }
    }).catch((err) => {
        res.json({
            success: false,
            swalTitle: "Saved Articles Collection",
            swalMsg: err,
            swalIcon: "error"
        });
    });
});

// delete article notes from the SavedArticle collection
router.get("/api/deletenotes/:articleId/:noteId", (req, res) => {
    console.log("Deleting saved articles notes");

    var articleId = req.params.articleId;
    var noteId = req.params.noteId;

    // delete notes first from the Notes collection
    db.Note.deleteOne({ _id: noteId }).then((result) => {
        console.log(result);
        if (result.n > 0) {
            db.SavedArticle.update({ _id: articleId }, { $pull: { "notes": noteId } }).then((result) => {
                console.log(result);
                res.redirect('/saved');
            });
        }
    });
});


// retrieve article notes from notes collection and saved article database
// displays notes for a particular saved article
router.get('/notes/:id?', (req, res) => {
    console.log("Retrieving Saved articles notes");
    var id = req.params.id;
    console.log(id)
    db.SavedArticle.find(id == undefined ? {} : { _id: id })
        .populate("notes")
        .then((article) => {
            res.json(article);
        });
});


// 5b56d452b7afb632ec92f437

// modify article notes

module.exports = router;