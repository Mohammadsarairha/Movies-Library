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



//const client = new pg.Client(DATABASE_URL);

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

function movieData(id, title, release_date, poster_path, overview, comment) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
    this.comment = comment;
};

app.get('/', indexPagedHandler);

function indexPagedHandler(request, response) {

    let newMovieData = new movieData(movies.title, movies.release_date, movies.poster_path, movies.overview);

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
                let trendMovie = new movieData(value.id, value.title, value.release_date, value.poster_path, value.overview);
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

    const sql = `INSERT INTO favmovie(title,release_date,poster_path,overview,comment) VALUES ($1, $2, $3,$4,$5) RETURNING *`
    const values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment];
    client.query(sql, values).then((result) => {
        response.status(201).json(result.rows);
    }).catch((error) => {
        errorHandler(error, request, response);
    });
};


app.get("/getMovies", getMoviesHandler);

function getMoviesHandler(request, response) {

    const sql = `SELECT * FROM favMovie `;

    client.query(sql).then((result) => {
        return response.status(200).json(result.rows);
    }).catch((error) => {
        errorHandler(error, request, response);
    });

};

//Request to update your comments for a specific movie in the database.
app.put("/UPDATE/:id", updateMovieHandler);

function updateMovieHandler(request, response) {
    const id = request.params.id;
    const movie = request.body;

    const sql = `UPDATE favmovie SET title=$1 ,release_date =$2,poster_path=$3, overview=$4,comment=$5 WHERE id= $6 RETURNING *; `;
    const values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment, id];

    client.query(sql, values).then((result) => {
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
    client.query(sql, values).then(() => {
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

    client.query(sql, value).then((result) => {
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

client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listen on ${PORT}`);
        });
    });

