const slsw = require("serverless-webpack");

module.exports = {
  target: "node",
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  node: false,
  optimization: {
    minimize: false,
  },
  externals: ["aws-sdk"],
};
