let mix = require('laravel-mix');
let glob = require("glob");
let globParent = require("glob-parent");
let path = require('path');

let HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlBuilder {
    register(input = {}) {
        if (!input.htmlRoot) {
            this.htmlRoot = './src/index.html';
        } else {
            this.htmlRoot = input.htmlRoot;
        }

        if (!input.output) {
            this.output = 'dist';
        } else {
            this.output = input.output;
        }

        if (!input.partialRoot) {
            this.partialRoot = './src/partials';
        } else {
            this.partialRoot = input.partialRoot;
        }

        if (!input.layoutRoot) {
            this.layoutRoot = './src/layouts';
        } else {
            this.layoutRoot = input.layoutRoot;
        }

        if (typeof input.minify === 'undefined') {
            this.minify = {
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            };
        } else {
            this.minify = input.minify;
        }

        this.inject = input.inject;

    }

    dependencies() {
        return [
            'filename-regex',
            'glob',
            'html-loader',
            'posthtml',
            'posthtml-extend',
            'posthtml-include',
            'posthtml-loader'
        ];
    }

    webpackRules() {
        const include = require('posthtml-include')({ root: this.partialRoot });
        const extend = require('posthtml-extend')({
            plugins: [ include ],
            root: this.layoutRoot
        });

        return {
            test: /\.html$/,
            use: [
                {
                    loader: 'posthtml-loader',
                    options: {
                        plugins: [
                            include,
                            extend
                        ]
                    }
                }
            ]
        };
    }

    webpackPlugins() {
        let filelist = [];
        let Plugins = [];

        let files = glob.sync(this.htmlRoot);
        files.forEach((file) => {
            filelist.push(file);
        });

        filelist.forEach((file) => {
            let htmlRootDir = globParent(this.htmlRoot);
            let filename = path.relative(htmlRootDir, file);
            Plugins.push(
                new HtmlWebpackPlugin({
                    filename: this.output + '/' + filename,
                    template: file,
                    inject: this.inject,
                    minify: this.minify
                })
            );
        });

        return Plugins;
    }

    webpackConfig(config) {
        // Fixes https://github.com/JeffreyWay/laravel-mix/issues/1717
        // To be removed in the future
        config.output.publicPath = '';
    }
}

mix.extend('buildHtml', new HtmlBuilder());
mix.extend('html', new HtmlBuilder());
