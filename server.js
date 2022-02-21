'use strict';

const express = require("express");
const movies = require("./Movie Data/data.json");

const app = express();

function movieData(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
};

app.get('/', indexPagedHandler);

function indexPagedHandler(request, response) {

    let result = [];
    movies.data.forEach((value) => {
        let newMovieData = new movieData(value.title, value.poster_path, value.overview);
        result.push(newMovieData);
    });
    return response.status(200).json(result);
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

});