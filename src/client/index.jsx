/* global APP_LOCALS */
/* eslint-disable no-console */

import React from 'react'
import {hydrate} from 'react-dom'
import {renderRoutes} from 'react-router-config'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {IntlProvider} from 'react-intl-redux'

import configStore from '../common/store'
import getRoutes from '../common/routes/config'
import {loadRoutes} from '../common/routes/helpers'


const store = configStore(APP_LOCALS)
let routeConfig = null

getRoutes()
	.then(_routeConfig => {
		routeConfig = _routeConfig
		return loadRoutes(routeConfig, location.pathname)
	})
	.then(() => hydrate(
		<Provider store={store}>
			<IntlProvider>
				<BrowserRouter>
					{renderRoutes(routeConfig, {loaded: true})}
				</BrowserRouter>
			</IntlProvider>
		</Provider>
		, document.getElementById('root')
	))
	.catch(err => {
		// todo: what is reasonable if we get an error here?
		console.error(err)
	})
