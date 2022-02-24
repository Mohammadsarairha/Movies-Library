'use strict';

const express = require("express");

const movies = require("./movieData/data.json");

const dotenv = require("dotenv");

const axios = require("axios");

const pg = require("pg");
const req = require("express/lib/request");

dotenv.config();

const app = express();

app.use(express.json());

const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;



const clinte = new pg.Client(DATABASE_URL);

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


app.post("/addMovie", addMovieHandler);


function addMovieHandler(request, response) {
    const movie = request.body;

    const sql = `INSERT INTO favmovie(title,poster_path,overview) VALUES ($1, $2, $3) RETURNING *`
    const values = [movie.title, movie.poster_path, movie.overview];
    clinte.query(sql, values).then((result) => {
        response.status(201).json(result.rows);
    }).catch((error) => {
        errorHandler(error, request, response);
    });
};


app.get("/getMovies", getMoviesHandler);

function getMoviesHandler(request, response) {

    const sql = `SELECT * FROM favMovie `;

    clinte.query(sql).then((result) => {
        return response.status(200).json(result.rows);
    }).catch((error) => {
        errorHandler(error, request, response);
        console.log(error);
    });

};

//Request to update your comments for a specific movie in the database.
app.put("/UPDATE/:id", updateMovieHandler);

function updateMovieHandler(request, response) {
    const id = request.params.id;
    const movie = request.body;

    const sql = `UPDATE favmovie SET title=$1 ,poster_path=$2, overview=$3 WHERE id= $4 RETURNING *; `;
    const values = [movie.title, movie.poster_path, movie.overview, id];

    clinte.query(sql, values).then((result) => {
        return response.status(200).json(result.rows);
    }).catch((error) => {
        errorHandler(error, request, response);
    });
};

//Request to remove a specific movie from your database.

app.delete("/DELETE/:id", deleteMovieHandler);

function deleteMovieHandler(request, response) {
    const id = request.params.id;
    const sql = `DELETE FROM favmovie WHERE id=$1`;
    const values = [id];
    clinte.query(sql, values).then(() => {
        return response.status(204).json({});
    }).catch((error) => {
        errorHandler(error, request, response);
    });
};

// Request to get a specific movie from the database

app.get("/getMovie/:id", getMovie);

function getMovie(request, response) {
    const id = request.params.id;

    const sql = `SELECT * FROM favmovie WHERE id=$1 ;`;
    const value = [id];

    clinte.query(sql, value).then((result) => {
        return response.status(200).json(result.rows);
    }).catch((error) => {
        errorHandler(error, request, response);
        console.log(error);
    });
};

function errorHandler(error, request, response) {
    const err = {
        status: 500,
        message: error
    }
    return response.status(500).send(err);
};

app.use("*", notFoundHandler);

function notFoundHandler(request, response) {
    return response.status(404).send("Not Found");
}

clinte.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listen on ${PORT}`);
        });
    });

