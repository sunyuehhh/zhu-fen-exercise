import { existsSync, rmSync } from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { wrapLoading } from '../utils/loading.js';
import { cloneAndCheckoutTag, getOrganizationProjects ,getProjectVersions} from '../utils/project.js';

export default async function (name, option) {
  const cwd = process.cwd(); // 获取当前项目的工程目录
  const targetDir = path.join(cwd, name);
  console.log(targetDir, 'targetDir');

  // 如果目录已存在，并且用户强制覆盖，则直接删除
  if (existsSync(targetDir) && option.force) {
    rmSync(targetDir, { recursive: true }); // 递归删除目录内容
  }
  // 如果目录存在，但未强制覆盖，则询问用户
  else if (existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: "目标已存在，是否覆盖？",
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '取消', value: false }
        ]
      }
    ]);

    if (!action) {
      return console.log("用户取消创建");
    }

    if (action === 'overwrite') {
      await wrapLoading("remove", () => {
        rmSync(targetDir, { recursive: true, force: true }); // 增加 force: true 避免报错
      });
    }
  }

  // 继续执行后续逻辑（如拉取项目模板）
 let projects= await getOrganizationProjects();

 console.log(JSON.stringify(projects))

  let { projectName } = await inquirer.prompt([
      {
        name: 'projectName',
        type: 'list',
        message: "请选择项目列表",//checkbox confirm list
        choices: projects
      }
    ]);

  // let tags=await getProjectVersions(projectName)
  // console.log(JSON.stringify(tags))
  // let {tag}=await inquirer.prompt([
  //   {
  //     name:'tag',
  //     type:'list',
  //     message:'请选择对应的版本',
  //     choices:tags
  //   }
  // ])

  // console.log(tag,projectName,'projectName')

  // 获取项目了  下载到本地
  // download-git-repo
  // 方案1  找zip包的下载地址 码云屏蔽掉  git clone
  await  cloneAndCheckoutTag('2.0',projectName,name)

}