
import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'

import store1 from './redux/store1'
import store2 from './redux/store2'
import user from './redux/user'
import intl from './redux/intl'

export default (state = {}) => {

	const middleware = [
		thunkMiddleware
	]

	if (process.env.NODE_ENV !== 'production') {
		if (typeof window !== 'undefined') {
			middleware.push(createLogger())
		}
	}

	return createStore(
		combineReducers({
			store1,
			store2,
			user,
			intl
		}),
		state,
		applyMiddleware(...middleware)
	)
}
