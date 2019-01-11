
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

class Page2 extends PureComponent {

	static propTypes = {
		data: PropTypes.array.isRequired
	}

	render () {
		return (
			<section>
				<FormattedMessage id="PAGE2.HELLO" />
				{this.props.data.map(item =>
					<article key={item.id}>{item.id}</article>
				)}
			</section>
		)
	}

}

const mapStateToProps = state => ({
	data: state.store2
})

export default connect(mapStateToProps)(Page2)
