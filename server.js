const express = require("express");///import express module
require('./config/connect'); // connect to database
const cors = require('cors'); //import cors module for cross-origin requests

const app = express(); //create an instance of express module  
app.use(express.json());    // to parse JSON bodies in the request

app.use(cors());// pour autoriser les requetes cross-origin (CORS)


const articleApi = require("./routes/article"); //import article routes qui est responsable de la gestion des articles
app.use('/article', articleApi); //use article routes
app.use('/getimage', express.static('./uploads')); //serveur pour les images uploadées

const authorApi = require("./routes/author"); //import author routes qui est responsable de la gestion des auteurs
app.use('/author', authorApi); //use author routes




//start server on port 3000
app.listen(3000, () => {
    console.log("server work");
})