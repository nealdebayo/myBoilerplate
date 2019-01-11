/* eslint-disable react/prefer-stateless-function */

import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'

class Home extends PureComponent {

	render () {
		return (
			<section>
				<FormattedMessage id="HOME.HELLO" />
			</section>
		)
	}

}

export default Home
