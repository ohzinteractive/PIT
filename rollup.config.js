import sourcemaps from 'rollup-plugin-sourcemaps';
// import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: './src/index.js',
    output: [
      {
        file: 'examples/build/PIT.module.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      sourcemaps()
    ]
  },
  {
    input: './src/index.js',
    output: [
      {
        file: 'examples/build/PIT.js',
        format: 'commonjs',
        sourcemap: true
      }
    ],
    plugins: [
      sourcemaps()
    ]
  }
];
