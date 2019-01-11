
'use strict'

const pathToRegexp = require('path-to-regexp')

function handlebarsExt (Handlebars) {

	Handlebars.registerHelper('json', (context) => {
		return JSON.stringify(context)
	})

	Handlebars.registerHelper('requirements', (context) => {

		if (!context.parameters) {
			return ''
		}

		return context.parameters.filter(parameter => parameter.required)
			.map(parameter => {
				let type = null
				switch (parameter.in) {
					case 'query': type = 'query'; break
					case 'path': type = 'param'; break
					case 'body': type = 'body'; break
				}
				return `if (req.${type}["${parameter.name}"] == null) { throw new Error("Expected ${parameter.name} got nothing")}\n`
			})
			.join('')
	})

	Handlebars.registerHelper('requestUrl', (context, options) => {

		let ret = ''
		let endpoint = `${options.hash.endpoint}`
		let hasParameters = false
		let hasPath = false

		if (context.parameters) {

			const pathParams = context.parameters.filter(parameter => parameter.in === 'path')
			const queryParams = context.parameters.filter(parameter => parameter.in === 'query')

			hasParameters = queryParams.length > 0
			hasPath = pathParams.length > 0

			if (hasParameters) {

				ret += 'const urlParams = {}\n'

				const params = queryParams.map(parameter => {
					return `if (req.query["${parameter.name}"] != null) { urlParams["${parameter.name}"] = req.query["${parameter.name}"] }\n`
				})

				ret += params.join('')

			}

			if (hasPath) {

				const compiler = pathToRegexp.compile(options.hash.endpoint)
				const compiled = unescape(compiler(pathParams.reduce((memo, item) => {
					memo[item.name] = `$\{req.param["${item.name}"]}`
					return memo
				}, {})))

				endpoint = compiled
			}

		}

		const server = options.hash.servers ? options.hash.servers[0].url : ''
		const basePath = options.hash.basePath ? options.hash.basePath : ''
		const qsparams = hasParameters ? '?${qs.stringify(urlParams)}' : ''

		ret += `const url = \`${server}${basePath}${endpoint}${qsparams}\`\n`

		return ret
	})

	Handlebars.registerHelper('requestOptions', (context, options) => {
		if (!context) { return '' }

		let ret = 'const options = {}\n'
		ret += 'options.headers = {}\n'

		if (['put', 'post'].indexOf(options.hash.method) > -1) {

			if (context.parameters) {
				const bodyParams = context.parameters.filter(parameter => parameter.in === 'body')
				if (bodyParams.length > 0) {
					ret += 'options.body = JSON.stringify({\n'
					ret += bodyParams.map(param => `'${param.name}': req.body['${param.name}']`)
					ret += '})\n'
				}
			} else if (context.requestBody) {



				ret += 'options.body = JSON.stringify(req.body)\n'

			}

			ret += `options.headers['Content-Type'] = 'application/json'\n`

		}

		if (options.hash.globalSecurity) {
			options.hash.globalSecurity.forEach(security => {
				const applications = Object.keys(security)
				for (const application of applications) {
					const definition = options.hash.securitySchemes[application]
					if (definition.in === 'header') {
						ret += `options.headers['${definition.name}'] = getToken(req)\n`
					}
				}
			})
		}

		if (context.security) {
			context.security.forEach(security => {
				const applications = Object.keys(security)
				for (const application of applications) {
					const definition = options.hash.securitySchemes[application]
					if (definition.in === 'header') {
						ret += `options.headers['${definition.name}'] = getToken(req)\n`
					}
				}
			})
		}

		ret += `options.method = '${options.hash.method.toUpperCase()}'\n`

		return ret
	})

}

module.exports = handlebarsExt
