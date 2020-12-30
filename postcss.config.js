const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
const postcssHash = require('postcss-hash');
const postcssNested = require('postcss-nested');
const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [
      './src/**/*.njk',
      './src/**/*.js',
      './src/**/*.svg',
      './src/**/*.md',
    ],
    safelist: [],

    // This is the function used to extract class names from your templates
    defaultExtractor: content => {
      // Capture as liberally as possible, including things like `h-(screen-1.5)`
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

      // Capture classes within other delimiters like .block(class="w-1/2") in Pug
      const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []

      return broadMatches.concat(innerMatches)
    }
});

const prodMode = process.env.NODE_ENV === 'production';

module.exports = (ctx) => {
  const plugins = [
    postcssPresetEnv,
    postcssImport({
      path: ['node_modules', 'src/_assets/css'],
    }),
    tailwindcss,
    postcssNested,
    autoprefixer
  ];

  if (prodMode) {
    plugins.push(
        cssnano,
        purgecss,
        postcssHash({
            algorithm: 'sha256',
            trim: 10,
            includeMap: true,
            manifest: 'public/built/manifest.json',
        })
    );
  }

  return {
      plugins
  };
};
