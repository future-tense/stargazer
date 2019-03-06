/* global require, __dirname, module */

const webpack = require('webpack');
const path = require('path');

const config = {
	context: path.resolve(__dirname, 'app'),
	entry: './root/app.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/stargazer.js'
	},
	module: {
		rules: [{
			test: /\.html$/,
			loader: 'html-loader'
		},{
			test: /\.svg$/,
			loader: 'file-loader',
			options: {
				outputPath: 'images'
			}
		}]
	},

	node: {
		Buffer: true,
		fs: 'empty'
	},

	externals: {
		'electron': 'commonjs electron'
	}
};

module.exports = config;
