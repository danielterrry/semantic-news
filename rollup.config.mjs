import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';

export default {
  input: 'index.js',
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: 'static/js/bundle.js',
    assetFileNames: 'static/css/[name][extname]',
  },
  plugins: [
    json(),
    scss({
      include: 'src/sass/style.scss',
      name: 'style.css',
      sourceMap: true,
      outputStyle: 'compressed',
    }),
    scss({
      include: 'src/sass/components/**/*.scss',
      output: false,
      includePaths: ['src/sass'],
    }),
    url({
      include: ['**/*.svg'],
    }),
    terser(),
  ],
};
