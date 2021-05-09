import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Jobs from './Jobs';
import Explore from './Explore';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Dashboard />}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => <Dashboard />}
						/>
						<Route
							path="/jobs"
							render={() => <Jobs />}
						/>
						<Route
							path="/explore"
							render={() => <Explore />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};