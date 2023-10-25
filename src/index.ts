import { sep, resolve } from 'path';
import fs from 'fs';
type Sidebar = SidebarGroup[] | SidebarMulti;

interface SidebarMulti {
  [path: string]: SidebarGroup[];
}

interface SidebarGroup {
  text: string;
  items: SidebarItem[] | SidebarGroup[];
  collapsed?: boolean;
}

interface SidebarItem {
  text: string;
  link: string;
}

interface Options {
  ignoreDirectory?: Array<string>; // Directoty path to ignore from being captured.
  ignoreMDFiles?: Array<string>; // File path to ignore from being captured.
  // If `true`, group is collapsible and collapsed by default
  // If `false`, group is collapsible but expanded by default
  collapsed?: boolean;
  // If not specified, group is not collapsible.
  collapsible?: boolean;
  // Default is true. Set false, will not remove number prefix, this options is for sort.
  pure?: boolean;
}
let glOptions: Options | undefined;

let prefixPath = '';

const getRelName = (name: string) => {
  // "What-is-Vitepress" or "What_is_Vitepress" or "what_is_vitepress" -> "What is Vitepress"
  let readName = name.replace(/[-_]/g, ' ');
  // "01.xxx" -> "xxx"
  if (glOptions?.pure) {
    readName = readName.replace(/^\d+./, '');
  }
  return readName;
};

// handle md file name
const getName = (path: string) => {
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
const getDirName = (path: string) => {
  const name = path.split(sep).pop() || path;
  return getRelName(name);
};

const getUrlPath = (path: string) => path.split(prefixPath).pop();

const getFiles = (baseDir: string, options?: Options) => {
  const fullPath = resolve(baseDir);
  const arr: Array<any> = [];
  // 递归遍历文件夹，获取所有文件
  fs.readdirSync(fullPath).forEach((item) => {
    // 直接跳过隐藏文件夹，如.git .vitepress
    if (item.indexOf('.') === 0) {
      return;
    }
    // 直接跳过忽略文件夹
    if (
      options?.ignoreDirectory?.length
      && options?.ignoreDirectory.findIndex(
        ignorePath => item.indexOf(ignorePath) !== -1,
      ) > -1
    ) {
      return;
    }

    const itemPath = `${fullPath}/${item}`;
    const isDir = fs.statSync(itemPath).isDirectory();
    const collapsible = options?.collapsible;
    let collapsed: boolean | undefined;
    if (!collapsible) {
      collapsed = undefined;
    } else {
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
    if (
      options?.ignoreMDFiles?.length
      && options?.ignoreMDFiles.findIndex(
        ignorePath => getName(itemPath) === ignorePath,
      ) > -1
    ) {
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

const getSidebar = function (baseDir: string, options?: Options) {
  glOptions = options;
  prefixPath = resolve(baseDir);
  const sidebarObject:Sidebar = getFiles(baseDir, options);
  return sidebarObject;
};

/**
 * @param   {String}    docDir   - Directory path, base on project docDir.
 * @param   {Options}    options   - Option to create configuration.
 */
export const sideBar = (docDir = 'docs', options?: Options) => getSidebar(docDir, { pure: true, ...options });
