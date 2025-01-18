const path = require("path");
const fs = require("fs");
const { runLoaders } = require("loader-runner");
// 这是我要使用loader处理的文件
const entryFile = path.resolve(__dirname, "src/index.js");

/**
 * -!: noPreAuto
 * ! noAuto
 * !!:noPrePostAuto
 */
// loader跟自己没有关系
let request = `inline-loader!inline-loader2!${entryFile}`;
const rules = [
  {
    test: /\.js$/,
    use: ["normal-loader1", "normal-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "pre",
    use: ["pre-loader1", "pre-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "post",
    use: ["post-loader1", "post-loader2"],
  },
];

let parts = request.replace(/^-?!+/, "").split("!");
let resource = parts.pop(); //取出最后一个元素，也就是要加载的文件或者说模块
let inlineLoaders = parts;
let preLoaders = [],
  postLoaders = [],
  normalLoaders = [];

for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.enforce == "pre") {
    preLoaders.push(...rule.use);
  } else if (rule.enforce == "post") {
    postLoaders.push(...rule.use);
  } else if (rule.enforce == "normal") {
    normalLoaders.push(...rule.use);
  }
}

let loaders = [];
if (request.startsWith("!!")) {
  loaders = inlineLoaders;
} else if (request.startsWith("-!")) {
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith("!")) {
  loaders = [...preLoaders, ...postLoaders];
} else {
  loaders = [...preLoaders, ...postLoaders, ...normalLoaders];
}

// 把loader从名称变为一个绝对路径
loaders = loaders.map((loader) => path.resolve(__dirname, "loader-chain", loader));
runLoaders(
  {
    resource: entryFile,
    loaders,
    readResource: fs.readFile,
  },
  (err, result) => {
    console.log(err);
    console.log(result.result[0].toString());
    console.log(result.resourceBuffer ? result.resourceBuffer.toString() : null);
  }
);
