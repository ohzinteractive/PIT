// import terser from '@rollup/plugin-terser';

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
    ]
  }
];
