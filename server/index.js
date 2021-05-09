const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/keywords/locations', routes.getTop10Locations);
app.get('/keywords/companies', routes.getTop10Companies);
app.get('/industries', routes.getIndustries);
app.get('/sectors', routes.getSectors);
app.get('/size', routes.getSize);
app.get('/filters/:industries', routes.filter); ///:sectors/:size

//app.get('/keywords/:keyword', routes.getTopMoviesWithKeyword);


//app.get('/jobs/:movieName', routes.getRecs);


//app.get('/decades', routes.getDecades);
//app.get('/genres', routes.getGenres);



//app.get('/applications', routes.bestMoviesPerDecadeGenre);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});