import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import KeywordButtonCompany from './KeywordButtonCompany';
import KeywordButtonLocation from './KeywordButtonLocation';
import DashboardResultRow from './DashboardResultRow';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      companies: [],
      jobs: []
    };

    this.showJobsByCompany = this.showJobsByCompany.bind(this);
    this.showJobsByLocation = this.showJobsByLocation.bind(this);
  };

  componentDidMount() {

    fetch("http://localhost:8081/keywords/companies", {
      crossDomain: true,
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(companiesList => {
      if (!companiesList) return;

      const companiesDivs = companiesList.map((companyObj, i) =>
        <KeywordButtonCompany
          id={"button-" + companyObj.company} 
          onClick={() => this.showJobsByCompany(companyObj.company)} 
          company={companyObj.company} 
        /> 
      );

      this.setState({
        companies: companiesDivs
      });
    }, err => {
      console.log(err);
    });

    fetch("http://localhost:8081/keywords/locations", {
      crossDomain: true,
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(locationsList => {
      if (!locationsList) return;

      const locationsDivs = locationsList.map((locationObj, i) =>
        <KeywordButtonLocation 
          id={"button-" + locationObj.location} 
          onClick={() => this.showJobsByLocation(locationObj.location)} 
          location={locationObj.location} 
        /> 
      );

      this.setState({
        locations: locationsDivs
      });
    }, err => {
      console.log(err);
    });


  };

  showJobsByCompany(company) {

    fetch("http://localhost:8081/keywords/companies/" + company, 
    {
			method: 'GET'
		}).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(jobList => {
      console.log(jobList)
      if (!jobList) return;

				const jobsDivs = jobList.map((jobObj, i) =>
					<DashboardResultRow
              company={jobObj.company}
              position={jobObj.position}
              location={jobObj.location}
              industry={jobObj.industry}
          />
				);

      this.setState({
        jobs: jobsDivs
      });
    }, err => {
      console.log(err);
    });
  };

  showJobsByLocation(location) {

    fetch("http://localhost:8081/keywords/locations/" + location, 
    {
			method: 'GET'
		}).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(jobList => {
      console.log(jobList)
      if (!jobList) return;

				const jobsDivs = jobList.map((jobObj, i) =>
					<DashboardResultRow
              company={jobObj.company}
              position={jobObj.position}
              location={jobObj.location}
              industry={jobObj.industry}
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
                <div className="header"><strong>Industry</strong></div>
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
