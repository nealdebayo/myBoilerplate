
import {matchRoutes} from 'react-router-config'

export const loadRoutes = (config, location) => Promise.all(
	matchRoutes(config, location).map(match => {
		const {component} = match.route
		if (component && component.component) {
			return component.component
		}
		return null
	})
)

export const loadActions = (config, location) =>
	matchRoutes(config, location).reduce((memo, match) => {
		const {component} = match.route
		if (component && component.actions) {
			return [...memo, ...component.actions]
		}
		return memo
	}, [])
