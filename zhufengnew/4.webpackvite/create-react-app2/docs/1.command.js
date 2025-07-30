const chalk=require('chalk')
const {Command}=require('commander')

let program=new Command('create-react-app')
program
.version('1.0.0')
.arguments('<must1> <must2> [option1] [option2]')//设置命令行的参数格式
.usage(`${chalk.green(`<must1> <must2> [option1] [option2]`)}`)
.action((must1,must2,option1,option2)=>{//指定命令的行为
  console.log(must1,must2,option1,option2,'*********')

})
.parse(process.argv)