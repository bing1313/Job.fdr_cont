import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/Explore.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExploreRow from './ExploreRow';

export default class Explore extends React.Component {
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

	componentDidMount() { 

		fetch("http://localhost:8081/industries", {
			crossDomain: true,
			method: 'GET' 
		  }).then(res => {
			return res.json();
		  }, err => {
			console.log(err);
		  }).then(industryList => {
			if (!industryList) return;
				

				let suggestionsList = [];
				// console.log("industry list" + industryList);
				// industryList.map((industryObj, i) => {
				// 	suggestionsList.push(industryObj.industryName);
				// 	console.log(industryObj.industryName);
				// })
				
            
				for (var i = 0; i < industryList.length; i++){
					var obj = industryList[i];
					suggestionsList.push(obj.industryName);
				}

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
					suggestionsList.push(obj.sectorName);
				}


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
	 
	 let new_suggestions = [];
	 if (input.length > 0){
		const regex = new RegExp(`^${input}`, `i`);
		new_suggestions = this.state.originalSuggestions.sort().filter(item => regex.test(item));
	 }
	
	 this.setState({
		 suggestions: new_suggestions
		 
	 });
	}


	handleSectorInputChange(e) {
		const input = e.target.value;
		let new_suggestions = [];
		if (input.length > 0){
		   const regex = new RegExp(`^${input}`, `i`);
		   new_suggestions = this.state.originalSectors.sort().filter(item => regex.test(item));
		}	   
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
					<button className="filBut" onClick={this.selectSector.bind(this, item)}> {item} </button>)
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
		
		let pickedIndustries= this.state.selectedIndustries;
		if (!pickedIndustries.includes(item)){
			pickedIndustries.push(item);
		}
		this.setState({
			selectedIndustries: pickedIndustries,
			//suggestions: []
		})
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

	   let industryFilters = this.state.selectedIndustries;
		   this.deleteFromArray(industryFilters, item);
		  this.setState({
			  selectedIndustries: industryFilters
		  })
	 	  this.showSuggestions();

	}

	deleteSectorFilter(item){
		console.log("delete selection industries: " + this.state.selectedSectors); 
		console.log("delete filter item" + item);
	  	let sectorFilters = this.state.selectedSectors;

		   this.deleteFromArray(sectorFilters, item);
		  	console.log("return from delete sector " + sectorFilters);
		  	this.setState({
			  	selectedSectors: sectorFilters
		  	})
	 	  this.showSectorSuggestions();

	}
	
	deleteFromArray(filtersList, item) {
		
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

		//make sure that they are all greater than 1
		if (industries.length < 1 || sectors.length < 1 || size == ""){
			console.log("please fill out all fields");
			return;
		} 

		fetch("http://localhost:8081/filters/" + industries + "/" + sectors + "/" + size,
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(jobsList => {
			if(!jobsList) return;

			
			const jobDivs = jobsList.map((jobObj, i) =>
				<ExploreRow 
				 company={jobObj.name}
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
			<div className="Explore">
				
				<PageNavbar active="explore"/>

				<div className="container applications-container">
					<div className="jumbotron">
						<div className="h1 explore-title">
							Explore careers
							<p className="h1 explore-title1">Please fill in all fields!</p>
							</div>
						

						<div className="industry-container">
						<div className="h5  explore-category">Industry</div>
							
								<input type="text" name="industry-input" className="input-box" placeholder="search industries"
									onChange={this.handleIndustryInputChange}/>
									{this.showSuggestions()}
							
							
								{this.state.selectedIndustries.map((item) => {
									return (
										
										<div className="option-filter">{item}
										<button type="button" className="del-btn" onClick={this.deleteFilter.bind(this,item)}>Delete</button>
										</div>
										
									)
								})}
							
						</div>

						<div className="sector-container">
							<div className="h5 explore-category">Sector</div>
							
								<input type="text" name="sector-input" className="input-box" placeholder="search sectors"
									onChange={this.handleSectorInputChange}/>
									{this.showSectorSuggestions()}
								
							<div className="selected-sectors">
								{this.state.selectedSectors.map((item) => {
									return (
										
										<div className="option-filter ">{item}
										<button type="button" className="del-btn" onClick={this.deleteSectorFilter.bind(this,item)}>Delete</button>
										</div>
										
									)
								})}
							</div>
						</div>

						<div className="h5  explore-category size-cont">Company Size</div>
						<div className="size drop-down">
							<select value={this.state.selectedSize} onChange={this.handleSizeChange} className="dropdown input-box" id="sizeDropdown">
								{this.state.sizes}
							</select>
							
							
						</div>

						<button className="filter-submit-btn" id="filter-submitBtn" onClick={this.submitFilters}>Submit</button>


					</div>
					<div className="jumbotron">
						<div className="header-container">
							<div className="headers">
			          <div className="header"><strong>Company</strong></div>
			          <div className="header"><strong>Position</strong></div>
					  <div className="header"><strong>Location</strong></div>
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
