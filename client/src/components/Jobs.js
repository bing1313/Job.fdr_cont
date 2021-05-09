import React from 'react';
import PageNavbar from './PageNavbar';
import JobsRow from './JobsRow';
import '../style/Jobs.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Jobs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "",
			location: "",
			searchOut: []
		};

		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	};

	handleTitleChange(e) {
		this.setState({
			title: e.target.value
		});
	};

	handleLocationChange(e) {
		this.setState({
			location: e.target.value
		});
	};

	submitSearch() {
		fetch("http://localhost:8081/jobs?title=" + this.state.title + "&location=" + this.state.location, 
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
            		company={searchObj.company}
					position={searchObj.position}
              		industry={searchObj.industry}
              		sector={searchObj.sector}
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
						<input type="text" className="search-title" placeholder="Title" value={this.state.title} onChange={this.handleTitleChange} /*id="search" className="search-input"*//>
						<input type="text" className="search-location" placeholder="Location" value={this.state.location} onChange={this.handleLocationChange} /*id="location" className="search-input"*//>
						<button type="submitSearchBtn" class="submit-btn" onClick={this.submitSearch}>Search</button>
						</div>
					</div>

					<div className="jumbotron">	
						<div className="header-container">
							<div className="h6">Jobs you may be interested in...</div>
							<div className="headers">
								<div className="header"><strong>Company</strong></div>
								<div className="header"><strong>Position</strong></div>
								<div className="header"><strong>Industry</strong></div>
								<div className="header"><strong>Sector</strong></div>
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
