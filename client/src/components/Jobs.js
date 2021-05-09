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
			location: "",
			searchOut: []
		};

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	};

	handleSearchChange(e) {
		this.setState({
			search: e.target.value
		});
	};

	handleLocationChange(e) {
		this.setState({
			location: e.target.value
		});
	};

	submitSearch() {
		fetch("http://localhost:8081/jobs/" + this.state.search, 
    	{
			method: 'GET'
		}).then(res => {
      		return res.json();
    	}, err => {
      		console.log(err);
    	}).then(searchList => {
      		if (!searchList) return;

			const searchDivs = searchList.map((searchObj, i) =>
				<JobsRow
            		company={searchObj.title}
					position={searchObj.movie_id}
              		location={searchObj.rating}
              		date={searchObj.num_ratings}
          		/>
			);

      		this.setState({
        		searchOut: searchDivs
      		});
    	}, err => {
      		console.log(err);
    	});
	};
	
	render() {
		return (
			<div className="Jobs">
				<PageNavbar active="jobs" />

				<div class="container"/>

				<div className="container jobs-container">
					<div className="jumbotron">
						<p>Search for available job openings</p>
						<div className="search-container">
						<input type="text" class="search-keyword" placeholder="Title or Company" value={this.state.search} onChange={this.handleSearchChange} /*id="search" className="search-input"*//>
						<input type="text" class="search-location" placeholder="Location" value={this.state.location} onChange={this.handleLocationChange} /*id="location" className="search-input"*//>
						<button type="submitMovieBtn" class="submit-btn" onClick={this.submitSearch}>Search</button>
						</div>
					</div>

					<div className="jumbotron">	
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
