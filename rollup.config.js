import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: './src/PIT.js',
    output: [
      {
        file: 'examples/build/PIT.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      sourcemaps(),
      terser()
    ]
  }
];
