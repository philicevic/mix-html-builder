# mix-html-builder
A quick laravel mix extension to build up html templates from partials and layouts.

## Installation

```
npm i -D mix-html-builder
```

## Usage

In your `webpack.mix.js` just use `mix.html()`. If you want to use the default configuration, you don't need to pass any arguments. Otherwise pass an object, like this:

```
# Require the extension in your config file
require('mix-html-builder');

mix.html({
    htmlRoot: './src/index.html', // Your html root file(s)
    output: 'dist', // The html output folder
    partialRoot: './src/partials',    // default partial path
    layoutRoot: './src/layouts',    // default partial path
    minify: {
        removeComments: true
    }
});
```

### Available options

Name | Type | Default | Description
--|---|---|--
`htmlRoot` | `{String}` | `'./src/index.html'` |  Your html root file. You can also use [glob](https://github.com/isaacs/node-glob#readme) patterns to use multiple files.
`layoutRoot` | `{String}` | `'./src/layouts'` |  Default path for html layout files
`partialRoot` | `{String}` | `'./src/partials'` |  Default path for html partial files
`output` | `{String}` | `'dist'` |  The folder where your output files should be saved
`inject` | `{Boolean}` | `false` |  Whether or not your css and javascript files should automatically included in your output
`minify` | `{Object}` | see [minify](#Minification) section |  An object with minify-options. See [minify](#Minification) for more information.
`versioning` | `{Boolean}` | `false` | Enables cache busting
`postHtmlConfig` | `{Object}` |  `{}` | You can configure posthtml-include and posthtml-extend. [More information](#PostHTML-Configuration)

### Include partials

With this package you can include other template files in your root html file.

`mix-html-builder` uses [posthtml-include](https://github.com/posthtml/posthtml-include) to include partials. More information about it is available in its docs.

Since `posthtml-include` v1.4 the passing of locals is supported, so we can pass data to our partials.
To do that, you can add a json inside the `locals` attribute as seen in the examples below.

#### HTML Root
`/src/index.html`:
```
<h1>Headline</h1>
<include src="text.html" locals='{
    "author": "John Doe"
}'></include>
```
Note that it will search for partials in `/src/partials` by default - you can change that by passing a `partialRoot`-option to `mix.html()` or you can just use a relative path in the include tag, like this:
```
<h1>Headline</h1>
<include src="../other-partials-folder/text.html"></include>
```

#### Partial
`/src/partials/text.html`:
```
<p>
    I am a wonderful and useless text, written by {{ author }}!
</p>
```

#### Output

When you run mix it will automatically generate `/dist/index.html` like this:
```
<h1>Headline</h1>
<p>
    I am a wonderful and useless text, written by John Doe!
</p>
```

### Extend layouts

You can also use layout files. This package uses [posthtml-extend](https://github.com/posthtml/posthtml-extend) for this, so head over to its docs if you want to get more information about options here.

#### HTML Root

Inside of your root file you can define data that should be passed to the layout. Use the `<block>` tag for this.

`/src/index.html`:
```
<extends src="layout.html">
    <block name="title">Page title</block>
</extends>
```
Note that it will search for layouts in `/src/layouts` by default - you can change that by passing a `layoutRoot`-option to `mix.html()` or you can just use a relative path in the include tag, like this:
```
<extends src="../other-layouts-folder/layout.html">
    <block name="title">Page title</block>
</extends>
```

#### Layout
`/src/layouts/layout.html`:
```
<body>
    <h1><block name="title" /></h1>
    <p class="content">
        I am quality content.
    </p>
</body>
```

#### Output

When you run mix it will automatically generate `/dist/index.html` like this:
```
<body>
    <h1>Page title</h1>
    <p class="content">
        I am quality content.
    </p>
</body>
```

### Minification

You have the possibility to minify your html code according to the [kangax/html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) package. Just add any option you need, it will be passed to the minifier. If you want to remove minification, just set its value to `false`;

#### Default value

The default value of this field is the following object:

```
{
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
}
```

### PostHTML-Configuration

You can configure `posthtml-include` and `posthtml-extend` with the `postHtmlConfig` option.

Example:

```
postHtmlConfig: {
    include: {
        // Your posthtml-include configuration goes here..
        encoding: 'utf-8'
    },
    extend: {
        // Your posthtml-extend configuration goes here..
        encoding: 'utf-8'
    }
}
```

For more information about the available options check [posthtml-include](https://github.com/posthtml/posthtml-include#options) and [posthtml-extend](https://github.com/posthtml/posthtml-extend#options).
