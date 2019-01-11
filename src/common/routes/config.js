
import App from '../components/App'
import AsyncRoute from './AsyncRoute'

import ErrorPage from '../pages/ErrorPage'
import {loadStore1Data} from '../redux/store1'
import {loadStore2Data} from '../redux/store2'

// todo:
// many of the route names will come from external service.
export default async () => {
	await new Promise(resolve => setTimeout(() => resolve()), 500)
	return [{
		component: App,
		routes: [{
			path: '/',
			exact: true,
			component: AsyncRoute({
				loader: () => import('../pages/Home.jsx')
			})
		}, {
			path: '/page1',
			component: AsyncRoute({
				loader: () => import('../pages/page1.jsx'),
				actions: [
					() => loadStore1Data([{id: '1'}, {id: '2'}])
				]
			})
		}, {
			path: '/page2',
			component: AsyncRoute({
				loader: () => import('../pages/page2.jsx'),
				actions: [
					() => loadStore2Data([{id: '3'}, {id: '4'}])
				]
			})
		}, {
			path: '*',
			status: 404,
			component: ErrorPage
		}]
	}]
}
