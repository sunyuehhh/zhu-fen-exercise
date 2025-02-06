// console.log(process.argv)//运行参数   两个参数  node的可执行文件  第二个参数是要执行的这个文件是谁
// vue-cli   webpack  vite ...
// yargs minimist  commander

const {program}=require('commander')
const pkg=require('./package.json')//vue create xxx --a
program.name(pkg.name)
program.usage('<command> [options]');//<>是必传  []选填写
program
.command('create')
.option('-d,--directory <directory>')
.action((args)=>{
  console.log(args,'args')


})
program.parse()
