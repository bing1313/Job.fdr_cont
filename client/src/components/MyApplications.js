import React from 'react';
import PageNavbar from './PageNavbar';
import BestMoviesRow from './ApplicationsRow';
import '../style/MyApplications.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SizeRow from './ApplicationsRow'; 
import ApplicationsRow from './ApplicationsRow';

export default class MyApplications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			selectedGenre: "",
			selectedSize: "",
			selectedIndustries: [],
			selectedSectors: [],
			decades: [],
			genres: [],
			movies: [],
			originalSuggestions: [],
			originalSectors: [],
			originalSize: [],
			sizes: [],
			sectorSuggestions: [],
			suggestions: [],
			jobs: []
		};

		this.handleDecadeChange = this.handleDecadeChange.bind(this);
		this.handleGenreChange = this.handleGenreChange.bind(this);
		this.handleSizeChange = this.handleSizeChange.bind(this);
		this.handleIndustryInputChange = this.handleIndustryInputChange.bind(this);
		this.handleSectorInputChange = this.handleSectorInputChange.bind(this);
	 	this.deleteFromArray = this.deleteFromArray.bind(this);
		this.decadesFilter = this.deleteFilter.bind(this);
		this.submitFilters = this.submitFilters.bind(this);
		//this.selectIndustry = this.selectIndustry.bind(this);
		//this.showSuggestions = this.showSuggestions.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() { 

		fetch("http://localhost:8081/industries", {
			crossDomain: true,
			method: 'GET' 
		  }).then(res => {
			return res.json();
		  }, err => {
			console.log(err);
		  }).then(industryList => {
			console.log(industryList)
			if (!industryList) return;
				

				let suggestionsList = [];
				// console.log("industry list" + industryList);
				// industryList.map((industryObj, i) => {
				// 	suggestionsList.push(industryObj.industryName);
				// 	console.log(industryObj.industryName);
				// })
				
            
				for (var i = 0; i < industryList.length; i++){
					var obj = industryList[i];
					console.log(obj)
					console.log("industry object " + i + " " + obj.industryName);
					suggestionsList.push(obj.industryName);
				}
				console.log("this is the suggestions list " + suggestionsList);

			this.setState({
				originalSuggestions : suggestionsList
			});
		  }, err => {
			console.log(err);
		  });

		  fetch("http://localhost:8081/sectors", {
			crossDomain: true,
			method: 'GET' 
		  }).then(res => {
			return res.json();
		  }, err => {
			console.log(err);
		  }).then(sectorsList => {
			console.log(sectorsList)
			if (!sectorsList) return;
				

				let suggestionsList = [];
				for (var i = 0; i < sectorsList.length; i++){
					var obj = sectorsList[i];
					console.log(obj)
					console.log("sectorobject " + i + " " + obj.sectorName);
					suggestionsList.push(obj.sectorName);
				}


				console.log("this is the initial sectors list " + suggestionsList);

			this.setState({
				originalSectors: suggestionsList
			});

		  }, err => {
			console.log(err);
		  });

		  fetch("http://localhost:8081/size", {
			
			method: 'GET' 
		  }).then(res => {
			return res.json();
		  }, err => {
			console.log(err);
		  }).then(sizeList => {
			console.log(sizeList)
			if (!sizeList) return;
				
				console.log("in size");
				const sizeDivs = sizeList.map((sizeObj, i) => 
					<option className="sizeOption" value={sizeObj.size}>{sizeObj.size}</option>
					
				);

			this.setState({
				sizes: sizeDivs
			});

		  }, err => {
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

	handleSizeChange(e) {
		this.setState({
			selectedSize: e.target.value
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


	handleSectorInputChange(e) {
		const input = e.target.value;
		console.log("input "+ input);
		console.log(this.state.originalSectors);
		let new_suggestions = [];
		if (input.length > 0){
		   const regex = new RegExp(`^${input}`, `i`);
		   new_suggestions = this.state.originalSectors.sort().filter(item => regex.test(item));
		   console.log("new suggestion list" + new_suggestions);
		}
		console.log("final state new_suggestions before set state" + new_suggestions);
	   
		this.setState({
			sectorSuggestions: new_suggestions
			
		});
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
			<div className="filterButton">
			<ul>
				{this.state.suggestions.map((item) => 
					<button className="filBut"  onClick={this.selectIndustry.bind(this, item)}> {item} </button>)
					}
			</ul>
			</div>
		);
	} 

	/**
	 * display the updated selectedSectorslist
	 * @returns 
	 */
	 showSectorSuggestions () {
		const { suggestions } = this.state.sectorSuggestions; //change this later
		// if (suggestions.length === 0){
		// 	return null;
		// }
		return (
			<div className="filterButton">
			<ul>
				{this.state.sectorSuggestions.map((item) => 
					<button className="filBut" class="btn btn-success" onClick={this.selectSector.bind(this, item)}> {item} </button>)
					}
			</ul>
			</div>
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
			selectedIndustries: pickedIndustries,
			//suggestions: []
		})
		console.log("selected industries list function " + this.state.selectedIndustries);
	}

	selectSector(item){	
		console.log("clicked item " + item);
		let picked = this.state.selectedSectors;
		console.log("selected sectors" + this.state.selectedSectors);
		if (!picked.includes(item)){
			picked.push(item);
		}

		this.setState({
			selectedSectors: picked,
			sectorSuggestions: []
		})
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

	

	submitFilters() {
		let industries = this.state.selectedIndustries; 
		let sectors = this.state.selectedSectors;
		let size = this.state.selectedSize;
		console.log("ind: " + industries);

		//make sure that they are all greater than 1
		// if (industries.length < 1 || sectors.length < 1 || size == ""){
		// 	console.log("please fill out all fields");
		// } 
		let indStr = industries[0];
		//create string 
		if (industries.length > 1){
				for (var i = 1; i < industries.length; i++){
					indStr += " OR \\`overview.industry\\' = \"" + industries[i] + "\"";
			
				}		
		console.log("indStr " + indStr);

		}
		//"/" + sectors + "/" + size

		fetch("http://localhost:8081/filters/" + industries,
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(jobsList => {
			console.log("filter retunrs");
			console.log(jobsList);
			if(!jobsList) return;

			
			//set the state of of the movies list to the value returned by the HTTP response from the server
			const jobDivs = jobsList.map((jobObj, i) =>
				<ApplicationsRow 
				 name={jobObj.name}
				 position={jobObj.position}
				 location={jobObj.location}
				/>
			)

			this.setState({
				jobs: jobDivs
			});
		}, err => {
			console.log(err);
		});
	}

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

						<div className="industry-container">
						<div className="h5">Industry</div>
							
								<input type="text" name="industry-input"
									onChange={this.handleIndustryInputChange}/>
									{this.showSuggestions()}
							
							
								{this.state.selectedIndustries.map((item) => {
									return (
										
										<div className="industry-filter">{item}
										<button type="button" onClick={this.deleteFilter.bind(this,item)}>Delete</button>
										</div>
										
									)
								})}
							
						</div>

						<div className="sector-container">
							<div className="h5">Sector</div>
							
								<input type="text" name="sector-input"
									onChange={this.handleSectorInputChange}/>
									{this.showSectorSuggestions()}
								
							<div className="selected-sectors">
								{this.state.selectedSectors.map((item) => {
									return (
										
										<div className="industry-filter">{item}
										<button type="button" onClick={this.deleteFilter.bind(this,item)}>Delete</button>
										</div>
										
									)
								})}
							</div>
						</div>

						<div className="h5">Company Size</div>
						<div className="size drop-down">
							<select value={this.state.selectedSize} onChange={this.handleSizeChange} className="dropdown" id="sizeDropdown">
								{this.state.sizes}
							</select>
							
							
						</div>

						<button className="filter-submit-btn" id="filter-submitBtn" onClick={this.submitFilters}>Submit</button>


					</div>
					<div className="jumbotron">
						<div className="movies-container">
							<div className="movie">
			          <div className="header"><strong>Company</strong></div>
			          <div className="header"><strong>Position</strong></div>
								<div className="header"><strong>Location</strong></div>
			        </div>
			        <div className="movies-container" id="results">
			          {this.state.jobs}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
