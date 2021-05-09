import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import KeywordButton from './KeywordButton';
import DashboardResultRow from './DashboardResultRow';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: [],
      movies: []
    };

    this.showMovies = this.showMovies.bind(this);
  };

  componentDidMount() {
    fetch("http://localhost:8081/keywords/locations",
    {
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(keywordsList => {
      if (!keywordsList) return;

      const keywordsDivs = keywordsList.map((keywordObj, i) =>
        <KeywordButton 
          id={"button-" + keywordObj.kwd_name} 
          onClick={() => this.showMovies(keywordObj.kwd_name)} 
          keyword={keywordObj.kwd_name} 
        /> 
      );

      this.setState({
        keywords: keywordsDivs
      });
    }, err => {
      console.log(err);
    });

    fetch("http://localhost:8081/keywords/companies",
    {
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(keywordsList => {
      if (!keywordsList) return;

      const keywordsDivs = keywordsList.map((keywordObj, i) =>
        <KeywordButton 
          id={"button-" + keywordObj.kwd_name} 
          onClick={() => this.showMovies(keywordObj.kwd_name)} 
          keyword={keywordObj.kwd_name} 
        /> 
      );

      this.setState({
        keywords: keywordsDivs
      });
    }, err => {
      console.log(err);
    });
  };

  showMovies(keyword) {

    fetch("http://localhost:8081/keywords/" + keyword, 
    {
			method: 'GET'
		}).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(movieList => {
      if (!movieList) return;

        // Map each movie in this.state.movies to an HTML element as a new DashboardMovieRow:
				const moviesDivs = movieList.map((movieObj, i) =>
					<DashboardResultRow
              title={movieObj.title}
              rating={movieObj.rating}
              votes={movieObj.num_ratings}
          />
				);

		  // Set the state of the movie list to the value returned by the HTTP response from the server.
      this.setState({
        movies: moviesDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  };

  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <div class="intro-header">
            <h1>Welcome to job.fndr!</h1>
            <h4>Take a look at some of our featured jobs</h4>
        </div>

        <br />
        <div className="container query-container">
          <div className="jumbotron">
            <div className="h4">Top Locations</div>
            <div className="keywords-container">
              {this.state.keywords}
            </div>
            <br />
            <div className="h4">Top Companies</div>
            <div className="keywords-container">
              {this.state.keywords}
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
                {this.state.movies}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};
