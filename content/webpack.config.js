module.exports = {
  entry: [
    './index.js',
  ],
  output: {
    path: __dirname + "/../extension/",
    publicPath: '/',
    filename: 'content.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
