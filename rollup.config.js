import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

export default {
  input: 'src/clipboard.jsx',
  external: ['react', 'react-dom', 'prop-types'],
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  plugins: [resolve(), commonjs(), babel({ exclude: 'node_modules/**' })]
};
