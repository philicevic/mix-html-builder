let mix = require('laravel-mix');
require('../../mix-html-builder');

// Disable mix-manifest.json
Mix.manifest.refresh = _ => void 0

mix.html({
    htmlRoot: './src/views/pages/**/*.html',
    output: 'public',
    partialRoot: './src/views/partials',
    layoutRoot: './src/views/layouts',
    minify: {
        removeComments: true
    },
    postHtmlConfig: {
        include: {
            encoding: 'utf-8',
        },
        extend: {
            encoding: 'utf-8',
        },
        expressions: {
            locals: {
                inProduction: mix.inProduction() ? 1 : 0,
                greeting: 'Hello!'
            }
        }
    }
});
