import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

dotenv.config();

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
      include: ['src/**/*.scss'],
    }),
    url({
      include: ['**/*.svg'],
    }),
    terser(),
    replace({
      preventAssignment: true,
      'process.env.API_BASE_URL': JSON.stringify(
        process.env.API_BASE_URL || '',
      ),
    }),
  ],
};
