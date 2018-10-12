let mix = require('laravel-mix');

var HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlBuilder {
    register(htmlRoot, output, partialRoot = './src/partials') {
        this.htmlRoot = htmlRoot;
        this.output = output;
        this.partialRoot = partialRoot;
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
        });
    }
}

mix.extend('buildHtml', new HtmlBuilder());
