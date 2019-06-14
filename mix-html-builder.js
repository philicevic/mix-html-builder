let mix = require('laravel-mix');

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
        var Plugins = [];
        if (Array.isArray(this.htmlRoot)) {
            this.htmlRoot.forEach(function(htmlRoot) {
                var filename = htmlRoot.substring(htmlRoot.lastIndexOf('/') + 1);
                Plugins.push(new HtmlWebpackPlugin({
                    filename: this.output + '/' + filename,
                    template: htmlRoot,
                    inject: this.inject
                }));
            }, this)
        } else {
            var filename = this.htmlRoot.substring(this.htmlRoot.lastIndexOf('/') + 1);
            Plugins.push(
                new HtmlWebpackPlugin({
                    filename: this.output + '/' + filename,
                    template: this.htmlRoot,
                    inject: this.inject
                })
            );
        }

        return Plugins;
    }
}

mix.extend('buildHtml', new HtmlBuilder());
mix.extend('html', new HtmlBuilder());
