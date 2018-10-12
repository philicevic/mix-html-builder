# mix-html-builder
A quick laravel mix extension to build up html templates from partials.

## Installation

```
npm i -D mix-html-builder
```

## Usage

In your `webpack.mix.js` just use `mix.buildHtml()`:

```
mix.buildHtml(
    './src/index.html', // Your html root file
    './out/index.html', // The html output file
    './src/partials'    // OPTIONAL: default partial path
);
```
