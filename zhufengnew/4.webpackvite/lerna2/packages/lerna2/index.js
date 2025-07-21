const cli = require('@lerna2/cli');
const initCmd = require('@lerna2/init/command');

function main(argv) {
  // cli返回的时yargs的实例
  // 配置init命令
  // 解析执行
  return cli().command(initCmd).parse(argv);
}

module.exports = main;
