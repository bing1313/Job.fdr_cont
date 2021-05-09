import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class KeywordButtonLocation extends React.Component {
	
	render() {
		return (
			<div className="keyword" id={this.props.id} onClick={this.props.onClick}>
				{this.props.location}
			</div>
		);
	};
};
