import os from 'os' //系统的信息都在这里
export function getNetWorkInterfaces(){
 return Object.values(os.networkInterfaces()).flat().filter(item=>item.family==='IPv4').map(item=>item.address)
}