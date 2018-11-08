# mix-html-builder
A quick laravel mix extension to build up html templates from partials.

## Installation

```
npm i -D mix-html-builder
```

## Usage

In your `webpack.mix.js` just use `mix.buildHtml()`. If you want to use the default configuration, you don't need to pass any arguments. Otherwise pass an object, like this:

```
mix.buildHtml({
    htmlRoot: './src/index.html', // Your html root file
    output: './out/index.html', // The html output file
    partialRoot: './src/partials'    // OPTIONAL: default partial path
});
```

### Available options

Name | Type | Default | Description
--|---|---|--
`htmlRoot` | `{String}` | `'./src/index.html'` |  Your html root file
`partialRoot` | `{String}` | `'./src/partials'` |  Default path for html partial files
`output` | `{String}` | `'index.html'` |  How your output html file should be named
`inject`* | `{Boolean}` | `false` |  Whether or not your css and javascript files should automatically included in your output

**\*KNOWN ISSUE**:
Due to an [issue in the laravel-mix core](https://github.com/JeffreyWay/laravel-mix/issues/1717) the `src` of script tag will have a leading double slash, which kills the functionality of it. Linking the css file yet works fine. I included the option as an experimental feature and I am working on a workaround to fix this until the development of mix will continue.

### Include partials

With this package you can include other template files in your root html file.

#### HTML Root
`/src/index.html`:
```
<h1>Headline</h1>
<include src="text.html"></include>
```
Note that it will search for partials in `/src/partials` by default - you could change that by editing the third parameter of `mix.buildHtml()` or you can just use a relative path in the include tag, like this:
```
<h1>Headline</h1>
<include src="../other-partials-folder/text.html"></include>
```

#### Partial
`/src/partials/text.html`:
```
<p>
    I am a wonderful and useless text!
</p>
```

#### Output

When you run mix it will automatically generate `/out/index.html` like this:
```
<h1>Headline</h1>
<p>
    I am a wonderful and useless text!
</p>
```
