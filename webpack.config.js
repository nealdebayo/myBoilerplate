
'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const WebpackMd5Hash = require('webpack-md5-hash')
const packageJson = require('./package.json')

function webpackConfig (_target) {

	const entry = _target === 'server'
		? './src/server/index.js'
		: './src/client/index.jsx'

	let target = null
	let targets = null
	const externals = []
	const minimizer = []

	const babelPlugins = [
		'@babel/plugin-transform-runtime',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread'
	]

	switch (_target) {
		case 'client':
			targets = '> 1%, not dead'
			babelPlugins.push('dynamic-import-webpack')
			target = 'web'
			break
		case 'server':
			targets = {node: 'current'}
			babelPlugins.push('dynamic-import-node')
			externals.push(nodeExternals())
			target = 'node'
			break
	}

	return (env, argv) => {

		let devtool = null

		if (argv.mode === 'production' && _target === 'client') {
			devtool = 'hidden-source-map'
		} else if (argv.mode === 'production' && _target === 'server') {
			devtool = 'source-map'
		} else if (argv.mode !== 'production') {
			devtool = 'source-map'
		}

		const chunkhash = argv.mode === 'production' ? '-[chunkhash]' : ''

		const plugins = [
			new webpack.DefinePlugin({
				'process.env.version': JSON.stringify(packageJson.version)
			}),
			new MiniCssExtractPlugin({
				filename: `[name]${chunkhash}.css`,
				chunkFilename: `[id]${chunkhash}.css`
			})
		]

		if (_target === 'client') {

			minimizer.push(
				new UglifyJsPlugin(),
				new OptimizeCSSAssetsPlugin({})
			)

			plugins.push(
				new HtmlWebpackPlugin({
					template: 'src/server/views/index.ejs',
					filename: '../server/views/index.ejs',
					favicon: 'src/common/assets/favicon.ico',
					minify: {
						collapseWhitespace: argv.mode === 'production'
					}
				})
			)

			if (argv.mode === 'production') {

				plugins.push(new WebpackMd5Hash())

			}

		} 

		const publicPath = '/assets/'

		return {
			name: 'Nealdebayo',
			target,
			externals,
			node: {
				__dirname: false
			},
			devtool,
			entry: path.resolve(entry),
			output: {
				path: path.resolve(`./dist/${_target}`),
				filename: _target === 'client' ? `Nealdebayo${chunkhash}.js` : 'server.js',
				libraryTarget: _target === 'server' ? 'commonjs2' : 'var',
				publicPath
			},
			optimization: {
				splitChunks: {
					chunks: 'all'
				},
				minimizer
			},
			resolve: {
				extensions: [
					'.webpack.js',
					'.web.js',
					'.js',
					'.jsx',
					'.less',
					'.json',
					'.scss'
				]
			},
			module: {
				rules: [{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							plugins: babelPlugins,
							presets: [
								['@babel/preset-env', {targets}],
								'@babel/preset-react'
							],
							sourceMap: true,
							retainLines: true
						}
					}
				}, {
					test: /\.json$/,
					loader: 'json-loader'
				}, {
					test: /\.ejs$/,
					loader: 'html-loader'
				}, {
					test: /\webfont\.(eot|svg|ttf|woff|woff2)(\?.*$|$)/i,
					loader: 'file-loader?name=fonts/[name].[ext]'
				}, {
					test: /\.(png|jpg|gif|svg)(\?.*$|$)/i,
					exclude: /\webfont\.(eot|svg|ttf|woff|woff2)(\?.*$|$)/i,
					loader: 'file-loader?name=image/[name].[ext]'
				}, {
					test: /\.(css|scss)$/,
					use: _target === 'server' ? 'ignore-loader' : [{
						loader: MiniCssExtractPlugin.loader
					}, {
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 1
						}
					}, {
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}]
				}]
			},
			plugins
		}
	}
}


module.exports = [
	webpackConfig('server'),
	webpackConfig('client')
]
