import sortBy from 'lodash/sortBy';
import remove from 'lodash/remove';
import { sep } from 'path';
import glob from 'glob';

type Sidebar = SidebarGroup[] | SidebarMulti;

interface SidebarMulti {
  [path: string]: SidebarGroup[];
}

interface SidebarGroup {
  text: string;
  items: SidebarItem[];
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
  const name = path.split(sep).pop() || path;
  // "Vuejs--What_is_vuejs" -> "What_is_vuejs"
  // const argsIndex = name.lastIndexOf('--');
  // if (argsIndex > -1) {
  //   name = name.substring(0, argsIndex);
  // }
  return getRelName(name);
};
// handle dir name
const getDirName = (path: string) => {
  const name = path.split(sep).shift() || path;
  return getRelName(name);
};

const getChildren = function (
  parentPath: string,
  ignoreMDFiles: Array<string> = [],
) {
  const pattern = '/**/*.md';
  const files = glob.sync(parentPath + pattern).map((path) => {
    const newPath = path.slice(parentPath.length + 1, -3);
    if (
      ignoreMDFiles?.length
      && ignoreMDFiles.findIndex(item => item === newPath) !== -1
    ) {
      return undefined;
    }
    return { path: newPath };
  });

  remove(files, file => file === undefined);
  // Return the ordered list of files, sort by 'path'
  return sortBy(files, ['path']).map(file => file?.path || '');
};

function side(baseDir: string, options?: Options) {
  glOptions = options;
  // const projectPath: string = process.env?.npm_config_local_prefix || '';
  const mdFiles = getChildren(baseDir, options?.ignoreMDFiles);

  const sidebars: Sidebar = [];
  mdFiles.forEach((item) => {
    const dirName = getDirName(item);
    if (
      options?.ignoreDirectory?.length
      && options?.ignoreDirectory.findIndex(item => getDirName(item) === dirName) !== -1
    ) {
      return;
    }
    const mdFileName = getName(item);
    const sidebarItemIndex = sidebars.findIndex(sidebar => sidebar.text === dirName);
    const collapsible = options?.collapsible;
    let collapsed;
    if (!collapsible) {
      collapsed = undefined;
    } else {
      collapsed = options.collapsed;
    }
    if (sidebarItemIndex !== -1) {
      sidebars[sidebarItemIndex].collapsed = collapsed;
      sidebars[sidebarItemIndex].items.push({
        text: mdFileName,
        link: item,
      });
    } else {
      sidebars.push({
        text: dirName,
        collapsed,
        items: [
          {
            text: mdFileName,
            link: item,
          },
        ],
      });
    }
  });

  return sidebars;
}

/**
 * @param   {String}    docDir   - Directory path, base on project docDir.
 * @param   {Options}    options   - Option to create configuration.
 */
export const sideBar = (docDir = 'docs', options?: Options) => side(docDir, { pure: true, ...options});
