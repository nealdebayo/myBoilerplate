
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

class Page1 extends PureComponent {

	static propTypes = {
		data: PropTypes.array.isRequired
	}

	render () {
		return (
			<section>
				<FormattedMessage id="PAGE1.HELLO" />
				{this.props.data.map(item =>
					<article key={item.id}>{item.id}</article>
				)}
			</section>
		)
	}

}

const mapStateToProps = state => ({
	data: state.store1
})

export default connect(mapStateToProps)(Page1)
