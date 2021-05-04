import React from 'react';
import PageNavbar from './PageNavbar';
import JobsRow from './JobsRow';
import '../style/Jobs.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Jobs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			search: "",
			searchOut: []
		};

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	};

	handleSearchChange(e) {
		this.setState({
			search: e.target.value
		});
	};

	submitSearch() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/jobs/" + this.state.search, 
    	{
			method: 'GET'
		}).then(res => {
      		// Convert the response data to a JSON.
      		return res.json();
    	}, err => {
      		// Print the error if there is one.
      		console.log(err);
    	}).then(searchList => {
      		if (!searchList) return;

        	// Map each movie in this.state.recMovies to an HTML element as a new JobsRow:
			const searchDivs = searchList.map((searchObj, i) =>
				<JobsRow
            		company={searchObj.title}
					position={searchObj.movie_id}
              		location={searchObj.rating}
              		date={searchObj.num_ratings}
          		/>
			);

		  	// Set the state of the recMovie list to the value returned by the HTTP response from the server.
      		this.setState({
        		searchOut: searchDivs
      		});
    	}, err => {
      		// Print the error if there is one.
      		console.log(err);
    	});
	};
	
	render() {
		return (
			<div className="Jobs">
				<PageNavbar active="jobs" />

				<div className="container jobs-container">
					<div className="jumbotron">
						<div className="h5">Jobs</div>
						<br></br>
						<div className="input-container">
							<input type='text' placeholder="Position or Company" value={this.state.search} onChange={this.handleSearchChange} id="search" className="search-input"/>
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch}>Search</button>
						</div>
						<div className="header-container">
							<div className="h6">Jobs you may be interested in...</div>
							<div className="headers">
								<div className="header"><strong>Company</strong></div>
								<div className="header"><strong>Position</strong></div>
								<div className="header"><strong>Location</strong></div>
								<div className="header"><strong>Date Posted</strong></div>
							</div>
						</div>
						<div className="results-container" id="results">
							{this.state.searchOut}
						</div>
					</div>
				</div>
			</div>
		);
	};
};
