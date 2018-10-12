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

### Include partials

Now you can include other temlate files in your root html file.

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
