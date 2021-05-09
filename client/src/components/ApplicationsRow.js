import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ApplicationsRow extends React.Component {
	/* ---- Q3b (Best Movies) ---- */
	render() {
		return (
			<div className="applicationRow">
				<div className="company-name">{this.props.name}</div>
				<div className="position">{this.props.position}</div>
				<div className="location">{this.props.location}</div>
			</div>
		);
	};
};
