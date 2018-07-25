# Mongo News Scraper

Mongo News Scraper is an application that scraps news articles into a MongoDb hosted on mlab. The application uses axios to scrape news and saves the articles into an Article collection. A user can decide to save the news articles into a SavedArticles collection. The user is able to save notes for each article in the Notes collection which are linked to the SavedArticles collection through the note id. The notes are saved in the SavedArticles collection through the populate function in MongoDb. The notes are also removed from the SavedArticle collection through the $pull function in the MongoDb update method.

SweetAlert2 has been used for dialogs that inform the user of what is happening during application navigation.

Express-handlebars are used for the front-end page rendering.


## Application Access

The application can be accessed on [Heroku](https://stormy-refuge-62380.herokuapp.com/)
