let mix = require('laravel-mix');
require('../../../mix-html-builder');

mix.html({
    minify: false
});
