import {Router} from 'express'
import fetch from 'node-fetch'
import qs from 'querystring'
import {getToken} from '../lib/token'

const router = new Router()

{{#each operation}}
	{{#each this.path}}
		{{#validMethod @key}}
/**
 {{#each ../descriptionLines}}
 * {{{this}}}
 {{/each}}
 */
router.{{@key}}('{{../../subresource}}', async (req, res, next) => {

	{{{requirements ..}}}

	{{{requestOptions .. method=@key securitySchemes=@root.swagger.components.securitySchemes globalSecurity=@root.swagger.security}}}

	{{{requestUrl .. endpoint=../../path_name servers=@root.swagger.servers basePath=@root.swagger.basePath}}}

	try {
		const result	= await fetch(url, options)
		const json = await result.json()
		if (!result.ok) {
			throw json
		}
		res.json(json)
	} catch (err) {
		next(err)
	}

})

		{{/validMethod}}
	{{/each}}
{{/each}}
export default router
