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

        if (typeof input.postHtmlInclude === 'undefined') {
            this.postHtmlInclude = { 
                root: this.partialRoot 
            }
        } else {
            this.postHtmlInclude = {
                ...input.postHtmlInclude, 
                root: this.partialRoot
            };
        }

        if (typeof input.postHtmlExtend === 'undefined') {
            this.postHtmlExtend = { 
                root: this.layoutRoot 
            }
        } else {
            this.postHtmlExtend = {
                ...input.postHtmlExtend, 
                root: this.layoutRoot 
            };
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
        return {
            test: /\.html$/,
            use: [
                {
                    loader: 'posthtml-loader',
                    options: {
                        plugins: [
                            require('posthtml-include')(this.postHtmlInclude),
                            require('posthtml-extend')(this.postHtmlExtend)
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