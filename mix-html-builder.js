let mix = require('laravel-mix');
let glob = require("glob");
let globParent = require("glob-parent");
let path = require('path');

let HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlBuilder {
    register(input = {}) {
        if (typeof input.htmlRoot === 'undefined') {
            this.htmlRoot = './src/index.html';
        } else {
            this.htmlRoot = input.htmlRoot;
        }

        if (typeof input.output === 'undefined') {
            this.output = 'dist';
        } else {
            this.output = input.output;
        }

        let partialRoot;
        if (typeof input.partialRoot === 'undefined') {
            partialRoot = './src/partials';
        } else {
            partialRoot = input.partialRoot;
        }

        let layoutRoot;
        if (typeof input.layoutRoot === 'undefined') {
            layoutRoot = './src/layouts';
        } else {
            layoutRoot = input.layoutRoot;
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

        if (typeof input.postHtmlConfig === 'undefined') {
            this.includeConfig = {
                root: partialRoot
            }
            this.extendConfig = {
                root: layoutRoot
            }
        } else {
            if (typeof input.postHtmlConfig.include === 'undefined') {
                this.includeConfig = {
                    root: partialRoot
                }
            } else {
                this.includeConfig = {
                    ...input.postHtmlConfig.include,
                    root: partialRoot
                }
            }

            if (typeof input.postHtmlConfig.extend === 'undefined') {
                this.extendConfig = {
                    root: layoutRoot
                }
            } else {
                this.extendConfig = {
                    ...input.postHtmlConfig.extend,
                    root: layoutRoot
                }
            }
        }

        this.inject = input.inject;

        this.versioning = input.versioning;
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
        const include = require('posthtml-include')(this.includeConfig);

        // Add posthtml-include to extend plugin list
        if (typeof this.extendConfig.plugins === 'undefined') {
            this.extendConfig.plugins = [ include ];
        } else {
            this.extendConfig.plugins.push(include);
        }
        const extend = require('posthtml-extend')(this.extendConfig);

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
                    minify: this.minify,
                    hash: this.versioning
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