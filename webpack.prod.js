const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.config.js');
const WrapperPlugin = require('wrapper-webpack-plugin');
const fs = require('fs');
const template = require('lodash.template');
const pkg = require('./package.json');

const header = fs.readFileSync('tamper.config.js');

module.exports = merge(config, {
    output: {
        filename: 'slack.files_tools.user.js',
    },
    plugins: [
        new WrapperPlugin({
            test: /\.js$/, // only wrap output of bundle files with '.js' extension
            header: template(header)(pkg) + '\n(function () { "use strict";\n',
            footer: '\n})();'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});