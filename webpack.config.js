// webpack.config.js
import Dotenv from "dotenv-webpack";

export const plugins = [
  new Dotenv({
    path: ".env", // default
    systemvars: true, // allow process.env from shell, too
  }),
];
