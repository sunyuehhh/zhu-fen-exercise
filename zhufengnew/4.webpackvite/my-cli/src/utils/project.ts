import axios from "axios"
import {exec} from 'child_process'
import util from 'util'
import { wrapLoading } from './loading.js'
import {getAllConfig} from '../commands/config.js'
import {rm} from 'fs/promises'
const execPromisified=util.promisify(exec)


const config:any=getAllConfig()

const {organization,accessToken}=config

export async function getOrganizationProjects(){
  const res=await axios.get(`https://gitee.com/api/v5/orgs/${organization}/repos`,{
    headers:{
      Authorization:`Bearer ${accessToken}`
    }
  })
  return res.data.map((item)=>item.name)
}


export async function getProjectVersions(repo) {
  const res=await axios.get(
    `https://gitee.com/api/v5/repos/${organization}/${repo}/tags`
  )
   return res.data.map((item)=>item.name)
}


export async function cloneAndCheckoutTag(tag,projectName,repo) {
  const cmd=`git clone --branch ${tag} --depth 1 https://gitee.com/${organization}/${projectName}.git ${repo}`;
  return wrapLoading("create project",async ()=>{
    await execPromisified(cmd)
    return rm(`${repo}/.git`,{recursive:true})
  })
  
}

