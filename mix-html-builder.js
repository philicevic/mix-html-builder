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
            this.output = 'index.html'
        } else {
            this.output = input.output;
        }

        if (!input.partialRoot) {
            this.partialRoot = './src/partials'
        } else {
            this.partialRoot = input.partialRoot;
        }

        this.inject = input.inject;
        
        this.minify = input.minify;
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
        return new HtmlWebpackPlugin({
            filename: this.output,
            template: this.htmlRoot,
            inject: this.inject,
        });
    }
}

mix.extend('buildHtml', new HtmlBuilder());
