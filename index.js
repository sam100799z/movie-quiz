const API_URL = "https://www.omdbapi.com";

// const url = "https://imdb8.p.rapidapi.com/auto-complete";
// const options = {
//   params: { q: "" },
//   headers: {
//     "X-RapidAPI-Key": "ea601fed8dmsha817f287daea8acp141049jsn46d586dec252",
//     "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
//   },
// };

import express, { Router } from "express";
const app = express();
const port = 3000;
import axios from "axios";
import bodyParser from "body-parser";
import csv from "csvtojson";
import env from "dotenv";
env.config();
import session from "express-session";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

async function filmTitle () 
{
    var randNumber = Math.random() * 250;
    var index = Math.floor(randNumber);

    // Load the films
    var films = await csv().fromFile("./IMDB Top 250 Movies.csv");
    

return films[index].name;

};

async function film() {
  // const options = {
  //   method: "GET",
  //   url: "https://imdb-top-100-movies.p.rapidapi.com/",
  //   headers: {
  //     "x-rapidapi-key": process.env.API_KEY,
  //     "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
  //   },
  // };

  // try {
  //   const response = await axios.request(options);
  //   const randNumber = Math.random() * 100;
  //   const index = Math.floor(randNumber);
  //   const film = response.data[index];
  //   return film;
  // } catch (error) {
  //   console.error(error);
  // }

  try {
    const movieTitle = await filmTitle(); 


    const response = await axios.get(`${API_URL}/?apikey=${process.env.KEY}&t=${movieTitle}`);

    const data = response.data;

    // console.log(data);
    return data;

    //   const response = await axios.request(options);
  //   const randNumber = Math.random() * 100;
  //   const index = Math.floor(randNumber);
  //   const film = response.data[index];

    // const question = data.Plot;
    // return question;
    
} 
catch (error) {

    console.error(error);     
    
}









}

// GET home page
app.get("/", async (req, res) => {
  const trivia = await axios.get(
    "https://opentdb.com/api.php?amount=1&category=11&type=multiple"
  );
  const triviaData = trivia.data.results[0];

  // removing stuff like &quot;, &amp;, &#039; from the trivia data
  triviaData.question = triviaData.question 
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'");

  res.render("home", { triviaData });


  // await film();
  // res.render("testing.ejs");
});

// GET game page
app.get("/game", async (req, res, next) => {
  try {
    const {
      Title,
      Plot,
      Poster,
      Genre,
      imdbRating, 
      Released,
      Director,
      Actors,
      Language,
      Writer

    } = await film();

    const info = `By the director ${Director}, ${Title} stars ${Actors} and is written by ${Writer} in the language of ${Language}. It was released on ${Released} and explores the genres of ${Genre}. It has an IMDB rating of ${imdbRating}.`;

    req.session.movieTitle = Title.toLowerCase();
    req.session.source = Poster;
    req.session.info = info;

    const description = Plot;

    res.render("index.ejs", {
      description: description,
      source: req.session.source,
      score: req.session.score,
    });
  } catch (error) {
    next(error);
  }
});

// POST quiz page
app.post("/game", async (req, res, next) => {
  try {
    if (req.body.movieTitle.toLowerCase() === req.session.movieTitle) {
      req.session.score = req.session.score ? req.session.score + 1 : 1;
      res.redirect("/game");
    } else {
      req.session.score = 0;
      res.redirect("/correct");
    }
  } catch (error) {
    next(error);
  }
});

// GET correct answer page
app.get("/correct", async (req, res, next) => {
  try {
    res.render("test.ejs", {
      movieTitle: req.session.movieTitle,
      source: req.session.source,
      description: req.session.info,
    });
  } catch (error) {
    next(error);
  }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong! " + err.message);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
