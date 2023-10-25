import { resolve, sep } from 'path';
import fs from 'fs';

let glOptions;
let prefixPath = '';
const getRelName = (name) => {
    // "What-is-Vitepress" or "What_is_Vitepress" or "what_is_vitepress" -> "What is Vitepress"
    let readName = name.replace(/[-_]/g, ' ');
    // "01.xxx" -> "xxx"
    if (glOptions === null || glOptions === void 0 ? void 0 : glOptions.pure) {
        readName = readName.replace(/^\d+./, '');
    }
    return readName;
};
// handle md file name
const getName = (path) => {
    let name = path.split(sep).pop() || path;
    name = name.slice(0, -3);
    // "Vuejs--What_is_vuejs" -> "What_is_vuejs"
    // const argsIndex = name.lastIndexOf('--');
    // if (argsIndex > -1) {
    //   name = name.substring(0, argsIndex);
    // }
    return getRelName(name);
};
// handle dir name
const getDirName = (path) => {
    const name = path.split(sep).pop() || path;
    return getRelName(name);
};
const getUrlPath = (path) => path.split(prefixPath).pop();
const getFiles = (baseDir, options) => {
    const fullPath = resolve(baseDir);
    const arr = [];
    // 递归遍历文件夹，获取所有文件
    fs.readdirSync(fullPath).forEach((item) => {
        var _a, _b;
        // 直接跳过隐藏文件夹，如.git .vitepress
        if (item.indexOf('.') === 0) {
            return;
        }
        // 直接跳过忽略文件夹
        if (((_a = options === null || options === void 0 ? void 0 : options.ignoreDirectory) === null || _a === void 0 ? void 0 : _a.length)
            && (options === null || options === void 0 ? void 0 : options.ignoreDirectory.findIndex(ignorePath => item.indexOf(ignorePath) !== -1)) > -1) {
            return;
        }
        const itemPath = `${fullPath}/${item}`;
        const isDir = fs.statSync(itemPath).isDirectory();
        const collapsible = options === null || options === void 0 ? void 0 : options.collapsible;
        let collapsed;
        if (!collapsible) {
            collapsed = undefined;
        }
        else {
            collapsed = options.collapsed;
        }
        if (isDir) {
            // 如果文件夹没有文件，直接跳过
            if (!fs.readdirSync(itemPath).length) {
                return;
            }
            const dirName = getDirName(itemPath);
            arr.push({
                text: dirName,
                items: getFiles(itemPath, options),
                collapsed,
            });
        }
        // 如果是忽略的文件，直接跳过
        if (((_b = options === null || options === void 0 ? void 0 : options.ignoreMDFiles) === null || _b === void 0 ? void 0 : _b.length)
            && (options === null || options === void 0 ? void 0 : options.ignoreMDFiles.findIndex(ignorePath => getName(itemPath) === ignorePath)) > -1) {
            return;
        }
        // 如果是markdown文件，放入数组中
        if (itemPath.indexOf('.md') > 0) {
            const fileName = getName(itemPath);
            arr.push({
                text: fileName,
                link: getUrlPath(itemPath),
            });
        }
    });
    return arr;
};
const getSidebar = function (baseDir, options) {
    glOptions = options;
    prefixPath = resolve(baseDir);
    const sidebarObject = getFiles(baseDir, options);
    return sidebarObject;
};
/**
 * @param   {String}    docDir   - Directory path, base on project docDir.
 * @param   {Options}    options   - Option to create configuration.
 */
const sideBar = (docDir = 'docs', options) => getSidebar(docDir, Object.assign({ pure: true }, options));

export { sideBar };
