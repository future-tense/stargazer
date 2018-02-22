/* global require, __dirname, module */

const webpack = require('webpack');
const path = require('path');

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
			include: path.resolve(__dirname, 'app'),
			use: [{
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}]
		}]
	},

	node: {
		Buffer: true
	},

	externals: {
		'electron': 'commonjs electron'
	}
};

module.exports = config;
