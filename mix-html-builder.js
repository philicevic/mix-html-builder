var mix = require('laravel-mix');
var regex = require('filename-regex');
var glob = require("glob")

var HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlBuilder {
    register(input = {}) {
        if (!input.htmlRoot) {
            this.htmlRoot = './src/index.html';
        } else {
            this.htmlRoot = input.htmlRoot;
        }

        if (!input.output) {
            this.output = 'dist'
        } else {
            this.output = input.output;
        }

        if (!input.partialRoot) {
            this.partialRoot = './src/partials'
        } else {
            this.partialRoot = input.partialRoot;
        }

        this.inject = input.inject;
    }

    dependencies() {
        return [
            'filename-regex',
            'glob',
            'html-loader',
            'posthtml',
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
                            require('posthtml-include')({ root: this.partialRoot })
                        ]
                    }
                }
            ]
        };
    }

    webpackPlugins() {
        let filelist = [];
        let Plugins = [];

        if (Array.isArray(this.htmlRoot)) {
            this.htmlRoot.forEach((htmlRoot) => {
                let files = glob.sync(htmlRoot);
                files.forEach((file) => {
                    filelist.push(file);
                });
            })
        } else {
            let files = glob.sync(this.htmlRoot);
            files.forEach((file) => {
                filelist.push(file);
            });
        }

        filelist.forEach((file) => {
            var filename = file.match(regex())[0];
            Plugins.push(
                new HtmlWebpackPlugin({
                    filename: this.output + '/' + filename,
                    template: file,
                    inject: this.inject
                })
            );
        });

        return Plugins;
    }
}

mix.extend('buildHtml', new HtmlBuilder());
mix.extend('html', new HtmlBuilder());
