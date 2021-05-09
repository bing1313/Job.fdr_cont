import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import KeywordButton from './KeywordButton';
import DashboardResultRow from './DashboardResultRow';
import axios from 'axios'

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      companies: [],
      jobs: []
    };

    this.showJobs = this.showJobs.bind(this);
  };

  componentDidMount() {
    axios.get('http://localhost:8081/keywords/companies').then((err, data) => {
      console.log(data)
    })
    console.log("mountain")
    fetch("http://localhost:8081/keywords/companies",
    {
      method: 'GET' 
    }).then(res => {
      console.log("fetched companies")
      return res.json();
    }, err => {
      console.log(err);
    }).then(companiesList => {
      console.log(companiesList)
      if (!companiesList) return;

      const companiesDivs = companiesList.map((companyObj, i) =>
        <KeywordButton 
          id={"button-" + companyObj.companyName} 
          onClick={() => this.showJobs(companyObj.companyName)} 
          company={companyObj.companyName} 
        /> 
      );

      this.setState({
        companies: companiesDivs
      });
    }, err => {
      console.log(err);
    });

    fetch("http://localhost:8081/keywords/locations",
    {
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(locationsList => {
      if (!locationsList) return;

      const locationsDivs = locationsList.map((locationObj, i) =>
        <KeywordButton 
          id={"button-" + locationObj.city} 
          onClick={() => this.showJobs(locationObj.city)} 
          location={locationObj.city} 
        /> 
      );

      this.setState({
        locations: locationsDivs
      });
    }, err => {
      console.log(err);
    });


  };

  showJobs(keyword) {

    fetch("https://localhost:8081/keywords/" + keyword, 
    {
			method: 'GET'
		}).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(jobList => {
      if (!jobList) return;

				const jobsDivs = jobList.map((jobObj, i) =>
					<DashboardResultRow
              company={jobObj.title}
              position={jobObj.rating}
              location={jobObj.num_ratings}
          />
				);

      this.setState({
        jobs: jobsDivs
      });
    }, err => {
      console.log(err);
    });
  };

  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <div className="intro-header">
            <h1>Welcome to job.fndr!</h1>
            <h4>Take a look at some of our featured jobs</h4>
        </div>

        <br />
        <div className="container query-container">
          <div className="jumbotron">
            <div className="h4">Top Companies</div>
            <div className="keywords-container">
              {this.state.companies}
            </div>
            <br />
            <div className="h4">Top Locations</div>
            <div className="keywords-container">
              {this.state.locations}
            </div>
          </div>

          <div className="jumbotron">
            <div className="query-container">
              <div className="jobs-header">
                <div className="header"><strong>Company</strong></div>
                <div className="header-lg"><strong>Position</strong></div>
                <div className="header"><strong>Location</strong></div>
                <div className="header"><strong>Date Posted</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.jobs}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};
