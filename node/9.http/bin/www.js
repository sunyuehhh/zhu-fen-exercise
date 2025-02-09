#! /usr/bin/env node

import {program} from 'commander'
import Server from '../src/index.js'



const commands={
  'port':{
    option:'-p,--port <port>',
    default:3000,
    description:'设置启动服务的端口',
    usage:'sy-server --port 3000'
  },
  "directory":{
    option:"-d,--directory <dirname>",
    default:process.cwd(),
    description:'设置启动服务的目录',
    usage:"sy-server --directory  /usr/xxx"
  }
}

const usages=[]
Object.entries(commands).forEach(([key,opt])=>{
  program.option(opt.option,opt.description,opt.default)
  usages.push(opt.usage)
})

program.on('--help',function(){
  console.log('\nExamples:')
  usages.map(item=>console.log(' '+item))
})

program.parse(process.argv)

console.log(program.opts())

new Server(program.opts()).start()