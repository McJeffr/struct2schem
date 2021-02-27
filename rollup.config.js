import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "@rollup/plugin-json";

import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [
    json(),
    resolve({ jsnext: true, main: true, browser: true }),
    commonjs(),
    typescript({ objectHashIgnoreUnknownHack: true }),
  ],
  external: ["fs", "zlib", "util", "prismarine-nbt"],
};
