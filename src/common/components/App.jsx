
/* eslint-disable react/forbid-component-props */

import React, {Fragment, PureComponent} from 'react'
import PropTypes from 'prop-types'
import {renderRoutes} from 'react-router-config'
import {Link} from 'react-router-dom'
import {FormattedMessage} from 'react-intl'
import {withRouter} from 'react-router'


class App extends PureComponent {

	static propTypes = {
		route: PropTypes.object.isRequired,
		loaded: PropTypes.bool.isRequired,
		//match: PropTypes.object.isRequired, // comes from withRouter, unused
		location: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired
	}

	constructor (props) {
		super(props)
		this.listener = null
		this.state = {loaded: props.loaded}
	}

	componentDidMount () {

		// if we change location, mark that we need to reload actions.
		// This ONLY happens for client-side (didMount)
		// for client, {loaded} is initially provided as TRUE (see client.jsx)
		// as we move around, we set it to FALSE, because we need to load the data.
		// loaded is only referenced in a didMount hook so it doesn't matter what server proviedes.

		this.listener = this.props.history.listen(location => {
			if (location.pathname !== this.props.location.pathname) {
				this.setState({loaded: false})
			}
		})
	}

	componentWillUnmount () {
		this.listener()
	}

	render () {
		return (
			<Fragment>
				<nav className="navbar navbar-expand-sm navbar-dark bg-primary">
					<div className="container">
						<div className="collapse navbar-collapse">
							<ul className="navbar-nav">
								<li className="nav-item">
									<Link className="nav-link" to="/">
										<FormattedMessage id="LINK.HOME"/>
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/page1">
										<FormattedMessage id="LINK.PAGE-1"/>
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/page2">
										<FormattedMessage id="LINK.PAGE-2"/>
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</nav>
				<br/>
				<main className="container">
					<div className="row">
						<div className="col-sm-12">
							<h1><FormattedMessage id="BANNER"/></h1>
							{renderRoutes(this.props.route.routes, {loaded: this.state.loaded})}
						</div>
					</div>
				</main>
			</Fragment>
		)
	}
}

export default withRouter(App)
