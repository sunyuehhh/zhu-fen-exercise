const yargs = require('yargs/yargs');

// 获取命令行参数
const argv = process.argv.slice(2);
const cli = yargs(argv);

// 所有命令得全局选项
const globalOptions = {
  logLevel: {
    type: 'string',
    describe: '日志得级别',
    defaultDescription: 'info',
    alas: 'L',
  },
};

const globalKeys = Object.keys(globalOptions).concat(['help', 'version']);

cli
  .options(globalOptions)
  .group(globalKeys, 'Global Options:')
  .usage('Usage: $0 <command> [options]')
  .demandCommand(1, '至少需要一个命令')
  .strict() //true严格模式  输入得命令不认识  会报错ERR! lerna Unknown command "xx"
  .recommendCommands() //Did you mean list?如果你写错了 他会帮你提建议
  .fail((msg, error) => {
    // 这里可以个性化你得错误展示
    console.error(msg);
    (console, error(error));
  })
  .alias('h', 'help')
  .alias('v', 'version')
  .epilogue(
    `When a command fails,all logs are written to lerna-debug.log in the current working directory`,
  )
  .command({
    command: 'create <name>', //命令得格式
    describe: '创建一个lerna管理的包',
    builder: (yargs) => {
      yargs
        .positional('name', {
          type: 'string',
          describe: '报名',
        })
        .options({
          registry: {
            group: 'Command Groups:',
            describe: '配置包的发布的仓库地址',
            type: 'string',
          },
        });
    },
    handler: (argv) => {
      console.log('执行init命令', argv);
    },
  })
  .parse(argv);

module.exports = cli;
