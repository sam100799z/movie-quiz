# cineEcstasy

A movie quiz app where users guess film titles based on plot descriptions. cineEcstasy pulls from the top 250 IMDb movies and uses an API to fetch each movie’s plot. Users earn points for correct answers in sequence, with the score resetting on incorrect guesses.

## Features

- Randomly selects movies from a CSV file with IMDb's top 250 films
- Uses an API to retrieve movie plots
- Scores increase for each correct answer, resetting to zero if incorrect
- Session-based score storage with no database or quiz history

## Technologies Used

- Node.js
- EJS for templating
- CSV file parsing
- Session storage for score tracking
