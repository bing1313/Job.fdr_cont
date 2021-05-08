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
			selectedIndustries: [],
			decades: [],
			genres: [],
			movies: [],
			originalSuggestions: [],
			suggestions: [],
		};

		this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
		this.handleDecadeChange = this.handleDecadeChange.bind(this);
		this.handleGenreChange = this.handleGenreChange.bind(this);
		this.handleIndustryInputChange = this.handleIndustryInputChange.bind(this);
	 	this.deleteFromArray = this.deleteFromArray.bind(this);
		this.decadesFilter = this.deleteFilter.bind(this);
		//this.selectIndustry = this.selectIndustry.bind(this);
		//this.showSuggestions = this.showSuggestions.bind(this);
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
	  
			let suggestionsList = [];
			for (var i = 0; i < genresList.length; i++){
				var obj = genresList[i];
				console.log("genres object " + i + " " + obj.name);
				suggestionsList.push(obj.name);
			}

			console.log("this is the suggestions list " + suggestionsList);
			// Map each genre in this.state.genres to an HTML option:
			const genresDivs = genresList.map((genreObj, i) =>
			  <option className="genresOption" key={i} value={genreObj.name}>{genreObj.name}</option>
			  
			);
	  
			// Set the state of the genre list to the value returned by the HTTP response from the server.
			this.setState({
			  genres: genresDivs,
			  originalSuggestions: suggestionsList 
			  
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

	/**
	 * 
	 * @param {*} e 
	 * when the input changes, filter the original suggestion for words that include 
	 * the input. 
	 */
	handleIndustryInputChange(e) {
	 const input = e.target.value;
	 console.log("input "+ input);
	 
	 let new_suggestions = [];
	 if (input.length > 0){
		const regex = new RegExp(`^${input}`, `i`);
		new_suggestions = this.state.originalSuggestions.sort().filter(item => regex.test(item));

		console.log("new suggestion list" + new_suggestions);
		//new_suggestions = ["hello", "hi"];
	 }
	 console.log("final state new_suggestions before set state" + new_suggestions);
	
	 this.setState({
		 suggestions: new_suggestions
		 
	 });

	 console.log("suggestions state handle Change" + this.state.suggestions);

	}
	
	/**
	 * display the updated selectedIndustries list
	 * @returns 
	 */
	showSuggestions () {
		const { suggestions } = this.state.suggestions; //change this later
		// if (suggestions.length === 0){
		// 	return null;
		// }

		return (
			<ul>
				{this.state.suggestions.map((item) => 
					<button onClick={this.selectIndustry.bind(this, item)}> {item} </button>)
					}
			</ul>
		);
	} 

	/**
	 * 
	 * @param {*} item 
	 * @returns When industry item is clicked, add it to list of selected industries and display it
	 * If the selected option already exists, then do nothing. Called when an industry button is selected
	 * to add to filters list
	 */
	selectIndustry(item){
		
		console.log("clicked item " + item);
       
		let pickedIndustries= this.state.selectedIndustries;
		if (!pickedIndustries.includes(item)){
			pickedIndustries.push(item);
		}
		
		this.setState({
			selectedIndustries: pickedIndustries
		})

		console.log("selected industries list function " + this.state.selectedIndustries);
	}

	/**
	 * 
	 * @param {*} category number 1,2 ,3.... corresponds to the appropraite list of filters that is
	 * being updated
	 * 1: industry
	 * 2: sector
	 * 3: salary
	
	 * @param {*} item the acutal value that matched in seach and deleted if it exists in the array
	 */
	deleteFilter(item){
		console.log("delete selection industries: " + this.state.selectedIndustries); 
		console.log("delete filter item" + item);
	   let industryFilters = this.state.selectedIndustries;
	
	//    if (industryFilters.includes(item)){
	// 		console.log("conatins");
		   this.deleteFromArray(industryFilters, item);
	//    } else {
	// 	   console.log("doesn't contain");
	//    }
		  console.log("after return industry filters " + industryFilters);
		  this.setState({
			  selectedIndustries: industryFilters
		  })
	 	  this.showSuggestions();

	}
	
	deleteFromArray(filtersList, item) {
		console.log("delete from array item: " + item);
		console.log("delete from array INITIAL array: "+ filtersList);

		
		for (var i=0; i < filtersList.length; i++){
			if (filtersList[i] === item){
				filtersList.splice(i, 1);
			}
		}

		console.log("delete from array FINAL array: "+ filtersList);
	}

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
				
				<PageNavbar active="applications"/>

				<div className="container applications-container">
					<div className="jumbotron">
						<div className="h5">My Applications</div>
						<div className="dropdown-container">
							<select value={this.state.selectedDecade} onChange={this.handleDecadeChange} className="dropdown" id="decadesDropdown">
								{this.state.decades}
							</select>
							<select type="text" value={this.state.selectedGenre} onChange={this.handleGenreChange} className="dropdown" id="genresDropdown">
								{this.state.genres}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>

						<div className="h5">Industry</div>
						<div className="industy-dropdown-container">
							<input type="text" name="industry-input"
								onChange={this.handleIndustryInputChange}/>
								{this.showSuggestions()}
							
						</div>
						<div className="selected-industries">
							{this.state.selectedIndustries.map((item) => {
								return (
									
									<div className="industry-filter">{item}
									<button type="button" onClick={this.deleteFilter.bind(this,item)}>Delete</button>
									</div>
									
								)
							})}
						</div>

						<button className="filter-submit-btn" id="filter-submitBtn" onClick={this.submitDecadeGenre}>Submit</button>


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
