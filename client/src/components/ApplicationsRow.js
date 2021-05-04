import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ApplicationsRow extends React.Component {
	/* ---- Q3b (Best Movies) ---- */
	render() {
		return (
			<div className="movieResults">
				<div className="title">{this.props.title}</div>
				<div className="id">{this.props.id}</div>
				<div className="rating">{this.props.rating}</div>
			</div>
		);
	};
};
