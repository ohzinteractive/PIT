// import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'examples/build/PIT.module.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
        outDir: undefined,
        sourceMap: true
      })
    ]
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: 'examples/build/PIT.js',
        format: 'commonjs',
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
        outDir: undefined,
        sourceMap: true
      })
    ]
  }
];
