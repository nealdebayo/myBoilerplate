/* eslint-disable no-console */
// todo: logger

import http from 'http'
import uuid from 'uuid'
import App from './app'

const {PORT = '3000'} = process.env

(async () => {

	const app = await App()

	const server = http.createServer(app).listen(PORT, () => {
		console.log(`listening on ${PORT}`)
	})

	const connections = {}
	let terminating = false

	server.on('connection', connection => {
		const id = uuid.v4()
		connection.idle = true
		connection.id = id
		connections[id] = connection
		connection.on('close', () => delete connections[id])
	})

	server.on('request', ({connection}, res) => {
		connection.idle = false
		res.on('finish', () => {
			connection.idle = true
			if (terminating) { connection.destroy() }
		})
	})

	async function terminate () {

		terminating = true

		const server_closer = new Promise(resolve => server.close(err => {
			if (err) { console.error(err) }
			resolve()
		}))

		for (const [, connection] of Object.entries(connections)) {
			if (connection.idle) {
				connection.destroy()
			}
		}

		await server_closer
		process.exit(0)

	}

	process.on('SIGTERM', terminate)
	process.on('SIGINT', terminate)

})()
	.catch(err => {
		console.error(err)
		process.exit(1)
	})
