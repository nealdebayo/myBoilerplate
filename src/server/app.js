
import path from 'path'
import express from 'express'
import {urlencoded, json} from 'body-parser'
import router from './router'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import connectRedisStore from 'connect-redis'

import getRoutes from '../common/routes/config'
import api from './api'

const {
	REDIS_HOST = 'localhost',
	REDIS_PORT = '6000',
	SESSION_TIMEOUT = '600',
	SESSION_SECRET = 'totally super-secure session secret'
} = process.env

const RedisStore = connectRedisStore(session)

// todo - fetch from service
async function getTranslations () {
	return {
		'en-US': {
			'HOME.HELLO': 'Welcome home!',
			'PAGE1.HELLO': 'Hello from Page1',
			'PAGE2.HELLO': 'Hello from Page2',
			'NOT-FOUND': 'couldnt find it!',
			'BANNER': 'Hello world',
			'LINK.HOME': 'Home',
			'LINK.PAGE-1': 'Page 1',
			'LINK.PAGE-2': 'Page 2'
		}
	}
}

export default async () => {

	const app = express()
	app.set('views', path.join(__dirname, 'views'))
	app.set('view engine', 'ejs')
	app.use('/assets', express.static('dist/client'))
	app.use(urlencoded({extended: false}))
	app.use(json())
	app.use(cookieParser())
	app.use(session({
		resave: true,
		saveUninitialized: false,
		secret: SESSION_SECRET,
		store: new RedisStore({
			host: REDIS_HOST,
			port: parseInt(REDIS_PORT, 10),
			ttl: parseInt(SESSION_TIMEOUT, 10)
		})
	}))

	app.locals.messages = await getTranslations()
	app.locals.routes = await getRoutes()

	app.use('/api', api)
	app.get('*', router)
	return app
}
