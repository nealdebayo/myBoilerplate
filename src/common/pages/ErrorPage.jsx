
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

class ErrorPage extends PureComponent {

	static propTypes = {
		staticContext: PropTypes.object,
		route: PropTypes.object.isRequired
	}

	constructor (props) {
		super(props)

		if (props.staticContext) {
			props.staticContext.status = props.route.status
		}
	}

	render () {
		return (
			<section>
				<FormattedMessage id="NOT-FOUND" />
			</section>
		)
	}

}


export default ErrorPage
