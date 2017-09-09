const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = merge(config, {
    output: {
        filename: 'slack.files_tools.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ]
});