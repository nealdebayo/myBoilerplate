/* eslint-disable */
// todo: configure this for front-end

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {renderRoutes} from 'react-router-config'
import {StaticRouter} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Provider} from 'react-redux'
import {IntlProvider} from 'react-intl-redux'

import configStore from '../common/store'
import {loadRoutes, loadActions} from '../common/routes/helpers'
import authentication from './middleware/authentication'
import localization from './middleware/localization'
import {addTranslations} from '../common/redux/intl'

export default [
  localization(),
  authentication(false),
  async (req, res, next) => {
    try {

      const context = {}
      const user = req.user
      const {locals} = req.app

      const store = configStore({user})

      store.dispatch(addTranslations(locals.messages[req.locale], req.locale))

      await loadRoutes(locals.routes, req.path)

      await Promise.all(loadActions(locals.routes, req.path).map(action => store.dispatch(action())))

      const app =
        <Provider store={store}>
          <IntlProvider>
            <StaticRouter context={context} location={req.path}>
              {renderRoutes(locals.routes, {loaded: true})}
            </StaticRouter>
          </IntlProvider>
        </Provider>

      const body = ReactDOMServer.renderToString(app)

      if (context.status) {
        res.status(context.status)
      }

      if (context.error) {
        throw context.error
      }

      if (context.url) {
        return res.redirect(context.url)
      }

      res.render('index', {
        body,
        state: store.getState(),
        helmet: Helmet.renderStatic()
      })

    } catch (err) {

      next(err)

    }
  }
]
