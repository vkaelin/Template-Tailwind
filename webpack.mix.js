let mix = require('laravel-mix');
let tailwindcss = require('tailwindcss');
let glob = require("glob-all");
let PurgecssPlugin = require("purgecss-webpack-plugin");

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

mix.postCss('src/css/main.css', 'public/css', [
  require('tailwindcss'),
])
.combine(['src/js/app.js'], 'public/js/app.js')
.copy('src/img/', 'public/img', false)
.options({
  processCssUrls: false
});

if (mix.inProduction()) {
  mix.webpackConfig({
    plugins: [
      new PurgecssPlugin({
        // Specify the locations of any files you want to scan for class names.
        paths: glob.sync([
          path.join(__dirname, "public/**/*.html"),
          path.join(__dirname, "public/**/*.php"),
          path.join(__dirname, "public/**/*.js")
        ]),
        extractors: [
          {
            extractor: TailwindExtractor,

            // Specify the file extensions to include when scanning for class names.
            extensions: ['html', 'js', 'php']
          }
        ]
      })
    ]
  });
}