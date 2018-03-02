/* global require, __dirname, module */

const webpack = require('webpack');
const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const config = {
	context: path.resolve(__dirname, 'app'),
	entry: './app.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'stargazer.js'
	},

	module: {
		rules: [{
			test: /\.js$/,
			include: [
				path.resolve(__dirname, 'app'),
				path.resolve(__dirname, 'node_modules/jsqrcode'),
				path.resolve(__dirname, 'node_modules/stellarterm-directory')
			],
			use: [{
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
					plugins: ['angularjs-annotate']
				}
			}]
		},{
			test: /\.html$/,
			loader: 'html-loader'
		},{
			test: /\.svg$/,
			loader: 'svg-loader'
		}]
	},

	node: {
		Buffer: true
	},

	externals: {
		'electron': 'commonjs electron'
	},

	plugins: [
		new HardSourceWebpackPlugin()
	]
};

module.exports = config;
