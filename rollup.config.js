import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import vueplugin from 'rollup-plugin-vue';
import sass from 'rollup-plugin-sass';
let version = '1.0.0';
let configCjs = {
  input: 'src/main.js',
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs',
    globals: {
      vue: 'Vue',
      d3: 'd3'
    },
    sourcemap: true,
    banner: '/* library version ' + version + ' */',
    footer: '/* @author xubowen */'
  },
  plugins: [
    sass({
      output: './dist/bundle.css' //设置sass编译完成路径;
    }),
    vueplugin(),
    resolve(),

    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ],

  //外部模块
  external: ['vue', 'd3']
};
let configUmd = {
  input: 'src/main.js',
  output: {
    file: 'dist/index.js',
    format: 'iife',
    name: 'mybunlde',
    globals: {
      vue: 'Vue',
      d3: 'd3'
    },
    sourcemap: true,
    banner: '/* library version ' + version + ' */',
    footer: '/* @author xubowen */'
  },
  plugins: [
    sass({
      output: './dist/bundle.css' //设置sass编译完成路径;
    }),
    vueplugin(),
    resolve(),

    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ],

  //外部模块
  external: ['vue', 'd3']
};
export default [configCjs, configUmd];
