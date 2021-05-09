const config = require('./db-config.js');
const mysql = require('mysql2');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

const getTop10Companies = (req, res) => {
  var query = `
      SELECT \`gaTrackerData.empName\` as company
      FROM (SELECT \`gaTrackerData.empName\`, COUNT(*) as numJobs 
      FROM glassdoor 
      WHERE \`gaTrackerData.empName\` is not null AND \`gaTrackerData.empName\` <> ""
      GROUP BY \`gaTrackerData.empName\`
      ORDER BY numJobs DESC) x
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
  
  const getTop10Locations = (req, res) => {
    var query = `
      SELECT \`map.location\` as location 
      FROM (SELECT \`map.location\`, COUNT(*) as numJobs 
      FROM glassdoor 
      GROUP BY \`map.location\` 
      ORDER BY numJobs DESC) x
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

const getTopJobsWithCompany = (req, res) => {
  var inputCompany = req.params.company;

  var query = `
      SELECT \`gaTrackerData.empName\` AS company, \`header.jobTitle\` AS position, \`map.location\` AS location, \`overview.industry\` AS industry
      FROM glassdoor
      WHERE \`gaTrackerData.empName\` = "${inputCompany}" AND \`map.location\` <> "" AND  \`overview.industry\` <> ""
      ORDER BY \`gaTrackerData.jobId.long\` DESC
      LIMIT 100;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

const getTopJobsWithLocation = (req, res) => {
  var inputLocation = req.params.location;

  var query = `
      SELECT \`gaTrackerData.empName\` AS company, \`header.jobTitle\` AS position, \`map.location\` AS location, \`overview.industry\` AS industry      
      FROM glassdoor
      WHERE \`map.location\` = "${inputLocation}" AND \`gaTrackerData.empName\` <> "" AND  \`overview.industry\` <> ""
      ORDER BY \`gaTrackerData.jobId.long\` DESC
      LIMIT 100;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

const JobsPerTitleLocation = (req, res) => {
  var inputTitle = req.query.title;
  var inputLocation = req.query.location;

  const query = `
      SELECT \`gaTrackerData.empName\` AS company, \`header.jobTitle\` AS position, \`overview.industry\` AS industry, \`overview.sector\` AS sector
      FROM glassdoor
      WHERE \`header.jobTitle\` LIKE "%${inputTitle}%" AND \`map.location\` LIKE "%${inputLocation}%" 
          AND \`gaTrackerData.empName\` <> "" AND  \`overview.industry\` <> "" AND  \`overview.sector\` <> ""
      ORDER BY \`gaTrackerData.jobId.long\` DESC
      LIMIT 100;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getIndustries = (req, res) => {
  console.log("getindustries routes");
  var query = `
   SELECT DISTINCT \`overview.industry\` as industryName
   from glassdoor 
  `;

connection.query(query, function(err, rows, fields) {
  if (err) console.log(err);
  else {
    console.log(rows);
    res.json(rows);
  }
});
};

const getSectors = (req, res) => {
  var query = `
   SELECT DISTINCT \`overview.sector\` as sectorName
   from glassdoor 
  `;

connection.query(query, function(err, rows, fields) {
  if (err) console.log(err);
  else {
    console.log(rows);
    res.json(rows);
  }
});
};

const getSize = (req, res) => {
  var query = `
   SELECT DISTINCT \`overview.size\` as size
   from glassdoor 
  `;

connection.query(query, function(err, rows, fields) {
  if (err) console.log(err);
  else {
    console.log(rows);
    res.json(rows);
  }
});
};

const filter = (req, res) => {
  var industries = req.params.industries;
  var sector = req.params.sector;
  var size = req.params.size;

  var industSplit= industries.split(",");
  var sectorSplit = sector.split(",");
 
  var industryStr = "";
  if (industSplit.length > 1) {
    for (var i = 1; i < industSplit.length; i++){
      industryStr += " OR \`overview.industry\` = \"" + industSplit[i] + "\"";
    }
  }

  var industryStr = "(\`overview.industry\` = \"" + industSplit[0] + "\"" + industryStr + ")";
  

  console.log(industryStr);

  var sectorStr = "";
  if (sectorSplit.length > 1) {
    for (var i = 1; i < sectorSplit.length; i++){
      sectorStr += " OR \`overview.sector\` = \"" + sectorSplit[i] + "\"";
    }
  }
  var sectorStr = "AND (\`overview.sector\` = \"" + sectorSplit[0] + "\"" + sectorStr + ")";

  var sizeStr = "AND (\`overview.size\` = \"" + size + "\")";
 

  var query = `
   SELECT \`gaTrackerData.empName\` as name, \`header.jobTitle\` as position, 
   \`map.location\` as location 
   from glassdoor 
   WHERE ${industryStr} ${sectorStr} ${sizeStr}
  `;

connection.query(query, function(err, rows, fields) {
  if (err) console.log(err);
  else {
    console.log(rows);
    res.json(rows);
  }
});
};



module.exports = {
	getTop10Companies: getTop10Companies,
  getTop10Locations: getTop10Locations,
	getTopJobsWithCompany: getTopJobsWithCompany,
  getTopJobsWithLocation: getTopJobsWithLocation,
  JobsPerTitleLocation: JobsPerTitleLocation,
  getIndustries: getIndustries,
  getSectors: getSectors,
  getSize: getSize,
  filter: filter
};