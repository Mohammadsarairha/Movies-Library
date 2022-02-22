# Movies-Library

**Author Name**: Mohammad-ALsarairha

**Project Version**:v16.13.2

## WRRC

![WRRC image](/assets/img/WRRC.jpg)

## Overview

The client send HTTP request to the server containing the specifications of the resource the client is asking for,These responses contain a status code and if the request was successful, The user can communicated through the request method. Four of the most common request methods are GET, POST, PUT, and DELTE,Then HTTP response is what is sent by a server to a client in response to an HTTP request. These responses contain a status code and if the request was successful,Finally Once the client receives the HTTP response, the browser will render the HTTP response body message.

## Getting Started

1. Create server.js file

2. npm init -y

3. npm install express

4. const express = require("express")

5. const app = express()

6. app.listen(PORT, ()=>{ console.log("Anything") })

7. I can create end points (ex: app.get("/favorite",favoriteHandeler))

8. I will create the function for that end point(ex: favoriteHandeler)

## Project Features

- Can check the latest movies based on categories.

- Add your movies to your favorite page.

- Show all details about movies .

## Request response cycle for movies project

![Request response cycle image](/assets/img/request_response_cycle.jpg)

## WRRC (POST & GET) Data from database

![Request response cycle image](/assets/img/WRRC(GET,POST).jpg)