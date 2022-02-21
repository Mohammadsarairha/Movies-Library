'use strict';

const express = require("express");
const movies = require("./movieData/data.json");

const app = express();

function movieData(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
};

app.get('/', indexPagedHandler);

function indexPagedHandler(request, response) {

    let newMovieData = new movieData(movies.title, movies.poster_path, movies.overview);

    return response.status(200).json(newMovieData);
};

app.get('/favorite', favoriteHandler);

function favoriteHandler(request, response) {

    return response.send("Welcome to Favorite Page");
};

app.use("*", notFoundHandler);

function notFoundHandler(request, response) {
    return response.status(404).send("Not Found");
}

app.listen(3000, () => {
    console.log("Listen on 3000");
});