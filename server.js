'use strict';

const express = require("express");

const movies = require("./movieData/data.json");

const dotenv = require("dotenv");

const axios = require("axios");

dotenv.config();

const app = express();

const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;


function movieData(id, title, poster_path, overview) {
    this.id = id;
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

app.get('/trending', trendinPageHandler);

function trendinPageHandler(request, response) {

    let result = [];

    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
        .then(apiResponse => {
            apiResponse.data.results.map(value => {
                let trendMovie = new movieData(value.id, value.title, value.poster_path, value.overview);
                result.push(trendMovie);
            })
            return response.status(200).json(result);
        }).catch(error => {
            errorHandler(error, request, response);
        })
};

function errorHandler(error, request, response) {
    const err = {
        status: 500,
        message: error
    }
    return response.status(500).send(err);
}

app.use("*", notFoundHandler);

function notFoundHandler(request, response) {
    return response.status(404).send("Not Found");
}

app.listen(PORT, () => {
    console.log(`Listen on ${PORT}`);
});