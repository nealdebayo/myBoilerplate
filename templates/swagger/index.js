import {Router} from 'express'
{{#each @root.swagger.endpoints}}
import {{.}} from './{{.}}.js'
{{/each}}

const router = new Router()
{{#each @root.swagger.endpoints}}
router.use('/{{.}}', {{.}})
{{/each}}

export default router
