import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/js/article-list.js',
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: 'static/js/bundle.js',
    assetFileNames: 'static/css/[name][extname]',
  },
  plugins: [
    json(),
    scss({
      name: 'style.css',
      sourceMap: true,
      outputStyle: 'compressed',
    }),
    terser(),
  ],
};
