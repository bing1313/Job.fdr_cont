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

app.get('/keywords/companies/:company', routes.getTopJobsWithCompany);
app.get('/keywords/locations/:location', routes.getTopJobsWithLocation);

app.get('/jobs', routes.JobsPerTitleLocation);

app.get('/industries', routes.getIndustries);
app.get('/sectors', routes.getSectors);
app.get('/size', routes.getSize);
app.get('/filters/:industries', routes.filter);


app.listen(8081, () => {
	console.log(`Server listening on PORT 3000`);
});