let mix = require('laravel-mix');
require('../../../mix-html-builder');

mix.html({
    htmlRoot: './src/minify.html',
    minify: true
});
