const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
// Equivalent to: function getTop20Keywords(req, res) {}
const getTop20Keywords = (req, res) => {
  var query = `
    WITH kwd_count AS (
        SELECT kwd_name, COUNT(*) AS cnt
        FROM movie_keyword
        GROUP BY kwd_name
        ORDER BY COUNT(*) DESC
    )
  
    SELECT kwd_name
    FROM kwd_count
    LIMIT 20
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- Q1b (Dashboard) ---- */
const getTopMoviesWithKeyword = (req, res) => {
  var inputKeyword = req.params.keyword;

  var query = `
    SELECT m.title, m.rating, m.num_ratings
    FROM movie m JOIN movie_keyword k ON m.movie_id = k.movie_id
    WHERE k.kwd_name = "${inputKeyword}"
    ORDER BY rating DESC, num_ratings DESC
    LIMIT 10 
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- Q2 (Recommendations) ---- */
const getRecs = (req, res) => {
  var inputMovie = req.params.movieName;

  var query = `
  
    WITH input_cast AS (
      SELECT a.cast_id
      FROM cast_in a JOIN movie b ON a.movie_id = b.movie_id
      WHERE b.title = "${inputMovie}"
    ), 

  shared_cast AS (
      SELECT c.movie_id, COUNT(i.cast_id) AS ct
      FROM cast_in c INNER JOIN input_cast i ON c.cast_id = i.cast_id
      GROUP BY c.movie_id
      ORDER BY COUNT(i.cast_id) DESC
    )

    SELECT m.title, m.movie_id, m.rating, m.num_ratings
    FROM shared_cast c JOIN movie m ON c.movie_id = m.movie_id
    WHERE m.title != "${inputMovie}"
    ORDER BY c.ct DESC, m.rating DESC, m.num_ratings DESC
    LIMIT 10;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- Q3a (Best Movies) ---- */
const getDecades = (req, res) => {
  const query = `
    SELECT CONCAT(LEFT(CAST(release_year AS varchar(4)), 3), '0') AS decade
    FROM movie
    GROUP BY LEFT(CAST(release_year AS varchar(4)), 3)
    ORDER BY decade ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- (Best Movies) ---- */
const getGenres = (req, res) => {
  const query = `
    SELECT name
    FROM genre
    WHERE name <> 'genres'
    ORDER BY name ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- Q3b (Best Movies) ---- */
const bestMoviesPerDecadeGenre = (req, res) => {
  var inputDecade = req.query.decade;
  // Delete last digit
  inputDecadeFix = Math.floor(inputDecade / 10);

  var inputGenre = req.query.genre;

  const query = `
    WITH genre_mean AS (
      SELECT g.genre_name, AVG(m.rating) AS avg_rat
      FROM movie_genre g JOIN movie m ON g.movie_id = m.movie_id
      WHERE m.release_year LIKE "${inputDecadeFix}%"
      GROUP BY g.genre_name 
    ),

    max_genre_avg AS (
      SELECT g.movie_id, MAX(m.avg_rat) AS rat
      FROM genre_mean m JOIN movie_genre g ON g.genre_name = m.genre_name
      GROUP BY g.movie_id
    ),

    filtered_movies AS (
        SELECT m.movie_id, m.title, m.rating, g.genre_name
        FROM movie m JOIN movie_genre g ON g.movie_id = m.movie_id    
        WHERE m.release_year LIKE "${inputDecadeFix}%" AND g.genre_name = "${inputGenre}"
    )

    SELECT m.movie_id, m.title, m.rating
    FROM filtered_movies m JOIN max_genre_avg a ON m.movie_id = a.movie_id
    WHERE m.rating > a.rat
    ORDER BY m.title ASC
    LIMIT 100;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

module.exports = {
	getTop20Keywords: getTop20Keywords,
	getTopMoviesWithKeyword: getTopMoviesWithKeyword,
	getRecs: getRecs,
  getDecades: getDecades,
  getGenres: getGenres,
  bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre
};