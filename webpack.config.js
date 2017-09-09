const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
    entry: ['./src/js/index.js','./src/css/default.scss'],
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin({
            clearConsole: true,
        }),
        new WebpackNotifierPlugin({
            title: 'Slack Files Tools',
            contentImage: path.join(__dirname,'src/logo2.png'),
            skipFirstNotification: true
        }),
    ]
};