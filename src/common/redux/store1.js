

const LOAD_DATA = '@@store1/LOAD_DATA'

export const loadStore1Data = data => async dispatch => {
	return new Promise(resolve => setTimeout(() => {
		dispatch({type: LOAD_DATA, data})
		resolve()
	}, 500))
}

const initialState = []

export default (state = initialState, action) => {
	if (action.type === LOAD_DATA) { return action.data }
	return state
}
