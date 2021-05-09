import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ExploreRow extends React.Component {
	render() {
		return (
			<div className="searchResults">
				<div className="company">{this.props.company}</div>
				<div className="position">{this.props.position}</div>
				<div className="location">{this.props.location}</div>
			</div>
		);
	};
};
