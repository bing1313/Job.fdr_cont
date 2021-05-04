import React from 'react';
import PageNavbar from './PageNavbar';
import BestMoviesRow from './ApplicationsRow';
import '../style/MyApplications.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class MyApplications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			selectedGenre: "",
			decades: [],
			genres: [],
			movies: []
		};

		this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
		this.handleDecadeChange = this.handleDecadeChange.bind(this);
		this.handleGenreChange = this.handleGenreChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() { 
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/decades",
		{
			method: 'GET' // The type of HTTP request.
		  }).then(res => {
			// Convert the response data to a JSON.
			return res.json();
		  }, err => {
			// Print the error if there is one.
			console.log(err);
		  }).then(decadesList => {
			if (!decadesList) return;

	 		// Map each decade in this.state.decades to an HTML element:
			const decadesDivs = decadesList.map((decadeObj, i) =>
			<option className="decadesOption" key={i} value={decadeObj.decade}>{decadeObj.decade}</option>
			);
	  
			// Set the state of the decade list to the value returned by the HTTP response from the server.
			this.setState({
			  decades: decadesDivs
			});
		  }, err => {
			// Print the error if there is one.
			console.log(err);
		  }); 

		  // Send an HTTP request to the server.
		fetch("http://localhost:8081/genres",
		{
			method: 'GET' // The type of HTTP request.
		  }).then(res => {
			// Convert the response data to a JSON.
			return res.json();
		  }, err => {
			// Print the error if there is one.
			console.log(err);
		  }).then(genresList => {
			if (!genresList) return;
	  
			// Map each genre in this.state.genres to an HTML option:
			const genresDivs = genresList.map((genreObj, i) =>
			  <option className="genresOption" key={i} value={genreObj.name}>{genreObj.name}</option>
			);
	  
			// Set the state of the genre list to the value returned by the HTTP response from the server.
			this.setState({
			  genres: genresDivs
			});
		  }, err => {
			// Print the error if there is one.
			console.log(err);
		  });

	};

	/* ---- Q3a (Best Movies) ---- */
	handleDecadeChange(e) {
		this.setState({
			selectedDecade: e.target.value
		});
	};

	handleGenreChange(e) {
		this.setState({
			selectedGenre: e.target.value
		});
	};

	/* ---- Q3b (Best Movies) ---- */
	submitDecadeGenre() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/applications?decade=" + 
				this.state.selectedDecade + "&genre=" + this.state.selectedGenre,
		{
			method: 'GET' 
		  }).then(res => {
			// Convert the response data to a JSON.
			return res.json();
		  }, err => {
			// Print the error if there is one.
			console.log(err);
		  }).then(bestMovieList => {
			if (!bestMovieList) return;

	 		// Map each movie in this.state.movies to an HTML element as a new BestMoviesRow:
			const bestMoviesDivs = bestMovieList.map((bestMovieObj, i) =>
				<BestMoviesRow
					title={bestMovieObj.title}
					id={bestMovieObj.movie_id}
				  	rating={bestMovieObj.rating}
				/>
			);
	  
			// Set the state of the movie list to the value returned by the HTTP response from the server.
			this.setState({
			  movies: bestMoviesDivs
			});
		  }, err => {
			// Print the error if there is one.
			console.log(err);
		  }); 
	};

	render() {
		return (
			<div className="MyApplications">
				
				<PageNavbar active="applications" />

				<div className="container applications-container">
					<div className="jumbotron">
						<div className="h5">My Applications</div>
						<div className="dropdown-container">
							<select value={this.state.selectedDecade} onChange={this.handleDecadeChange} className="dropdown" id="decadesDropdown">
								{this.state.decades}
							</select>
							<select value={this.state.selectedGenre} onChange={this.handleGenreChange} className="dropdown" id="genresDropdown">
								{this.state.genres}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>
					</div>
					<div className="jumbotron">
						<div className="movies-container">
							<div className="movie">
			          <div className="header"><strong>Title</strong></div>
			          <div className="header"><strong>Movie ID</strong></div>
								<div className="header"><strong>Rating</strong></div>
			        </div>
			        <div className="movies-container" id="results">
			          {this.state.movies}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
