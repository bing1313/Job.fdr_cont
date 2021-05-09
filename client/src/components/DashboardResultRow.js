import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class DashboardResultRow extends React.Component {

	render() {
		return (
			<div className="item">
				<div className="company">{this.props.title}</div>
				<div className="position">{this.props.rating}</div>
				<div className="location">{this.props.votes}</div>
			</div>
		);
	};
};
