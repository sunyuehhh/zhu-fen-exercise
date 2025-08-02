var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { exec } from 'child_process';
import util from 'util';
import { wrapLoading } from './loading.js';
const execPromisified = util.promisify(exec);
export const defaultConfig = {
    // 用户可以通过命令行来配置
    organization: "heng-chu",
    accessToken: "933ee0c2e9e11f414c1909861965fb1d"
};
const { organization, accessToken } = defaultConfig;
export function getOrganizationProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios.get(`https://gitee.com/api/v5/orgs/${organization}/repos`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return res.data.map((item) => item.name);
    });
}
export function getProjectVersions(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios.get(`https://gitee.com/api/v5/repos/${organization}/${repo}/tags`);
        return res.data.map((item) => item.name);
    });
}
export function cloneAndCheckoutTag(tag, projectName, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = `git clone --branch ${tag} --depth 1 https://gitee.com/${organization}/${projectName}.git ${repo}`;
        return wrapLoading("create project", () => __awaiter(this, void 0, void 0, function* () {
            return execPromisified(cmd);
        }));
    });
}
