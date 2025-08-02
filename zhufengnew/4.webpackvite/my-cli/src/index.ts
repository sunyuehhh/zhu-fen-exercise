#! /usr/bin/env node
import {program} from 'commander'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import {dirname,join} from 'path'

const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename)
const require=createRequire(import.meta.url)

const pkg=require(join(__dirname,"../package.json"))

program.version(`my-cli@${pkg.version}`).usage("<command> [option]")

// 1.通过脚手架来创建一个项目  create(拉取仓库中的模板，下载方式可以采用github gitlab gitee)
// 2.配置拉取的信息 配置系统文件  config

program
  .command("create <project-name>")
  .description("create a project")
  .option("-f, --force","overwrite target directory")
  .action(async (name,option)=>{
    // require("./commands/create")(name,option);//自己实现
    (await import("./commands/create.js")).default(name,option);//自己实现

  })

//my-cli config --set a 1
//my-cli config --get a
program
  .command("config [value]")
  .description("inspect config")
  .option("-g,--get <path>","get value")
  .option("-s,--set <path> <value>","set value")
  .option("-d,--delete <path>","delete value")
  .action(async (value,option)=>{
    (await import("./commands/config.js")).default(name,option);//自己实现

  })



  program.addHelpText(
    'after',
    `\nRun vue <command> --help for detailed usage of given command`
  )

// 需要接续用户传递的参数
program.parse(process.argv)