
// this is the same as the `react-intl-redux` reducer but allows for injecting individual keys

import {createSelector} from 'reselect'

export const getMessages = createSelector(state => state.intl.messages, messages => messages)

const ADD_TRANSLATION = '@@i81n/ADD_TRANSLATION'
export const addTranslations = (messages, locale) => ({type: ADD_TRANSLATION, messages, locale})

const initialState = {
	locale: 'en-US',
	messages: {}
}

export default (state = initialState, action) => {
	if (action.type === ADD_TRANSLATION) {
		return {
			locale: action.locale,
			messages: {...state.messages, ...action.messages}
		}
	}
	return state
}
