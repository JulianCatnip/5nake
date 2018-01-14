var path = require('path');
    var webpack = require('webpack');

    var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

    // Phaser webpack config
    var phaserModule = path.join(__dirname, './node_modules/phaser-ce/');
    var pixi = path.join(phaserModule, 'build/custom/pixi.min.js');
    var p2 = path.join(phaserModule, 'build/custom/p2.min.js');
    var phaser = path.join(phaserModule, 'build/custom/phaser-split.min.js');

    module.exports = {
        entry: './jsProto/main.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'snake.min.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                },
                { test: /pixi\.min\.js/, loader: 'expose-loader?PIXI' },
                { test: /phaser-split\.min\.js$/, loader: 'expose-loader?Phaser' },
                { test: /p2\.min\.js/, loader: 'expose-loader?p2' }
            ]
        },
        resolve: {
            extensions: ['.js'],
            modules: [ path.join(__dirname, 'node_modules'), path.join(__dirname, 'src') ],
            alias: {
              'phaser': phaser,
              'pixi': pixi,
              'p2': p2
            }
        },
        stats: {
            colors: true
        },
        devtool: 'inline-source-map',
        plugins: [
          new UglifyJSPlugin()
        ]
};