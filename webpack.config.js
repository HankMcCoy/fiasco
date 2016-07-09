const path = require('path')

module.exports = {
	entry: path.join(__dirname, 'src/client/app.js'),
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.js',
	},
	module: {
		loaders: [
			{
				test: /.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015'],
				},
			}
		],
	},
}
