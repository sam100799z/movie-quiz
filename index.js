
// this is a quiz game kind of interface in which 
// you have to guess the movie name from its plot

import express from "express"; 
import axios from "axios";
import bodyParser from "body-parser";


// we will use this express session to store the real answer and then verify user's guess with it
import session from "express-session";

import env from "dotenv";

// this reads the csv and converts the csv data into json
import csv from "csvtojson";


const app = express();
const port = 3000;
const API_URL = "https://www.omdbapi.com";


// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




env.config();


app.use(session({
    secret: process.env.SECRET   ,
    resave: false,
    saveUninitialized: true
}))







// STEP 2 - now we have a random number, we need a random film title as well
async function filmTitle () 
{
    var randNumber = Math.random() * 250;
    var index = Math.floor(randNumber);

    // Load the films
    var films = await csv().fromFile("./IMDB Top 250 Movies.csv");
    

return films[index].name;

};


// STEP 3 - now we have got the title, we just need plot to display it on the screen

async function filmPlot(req) 
{
    try {
    const movieTitle = await filmTitle(); 


    req.session.movieTitle = movieTitle;
    const response = await axios.get(`${API_URL}/?apikey=${process.env.KEY}&t=${movieTitle}`);

    const data = response.data;

    const question = data.Plot;
    return question;
    
} 
catch (error) {

    console.error(error);     
    
}


};


// STEP 4 - now we have everything, we only have to take care of the requests now

let totalCorrect = 0;

// GET home page
app.get("/", async (req, res) => {


    const Plot = await filmPlot(req);






    res.render("index.ejs",
    { 
        plot : Plot,
        score : totalCorrect
    });
});

app.post("/submit", async(req,res) => 
  {



    if (req.body.userInput.toLowerCase()===req.session.movieTitle.toLowerCase()) {
        totalCorrect++;
        res.redirect("/"); 
    } else {
        totalCorrect=0;
        res.redirect("/");
    } 
  });








  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
