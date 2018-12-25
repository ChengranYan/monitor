import babel from 'rollup-plugin-babel'

let babelConfig = {
  presets: [
    [
      "@babel/preset-env", {
        "modules": false,
        "targets": {
          "browsers": ["chrome > 40", "safari >= 7"]
        }
      }
    ]
  ]
};

export default {
  input: 'src/index.js',
  output: {
    file: '../website/public/monitor.js',
    format: 'umd'
  },
  watch: {
    exclude: 'node_modules/**'
  },
  plugins: [babel({
    exclude: 'node_modules/**',
    presets: babelConfig.presets
  })]
}