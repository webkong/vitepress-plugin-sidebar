import sortBy from 'lodash/sortBy';
import remove from 'lodash/remove';
import { sep } from 'path';
import glob from 'glob';

let glOptions;
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
    const name = path.split(sep).pop() || path;
    // "Vuejs--What_is_vuejs" -> "What_is_vuejs"
    // const argsIndex = name.lastIndexOf('--');
    // if (argsIndex > -1) {
    //   name = name.substring(0, argsIndex);
    // }
    return getRelName(name);
};
// handle dir name
const getDirName = (path) => {
    const name = path.split(sep).shift() || path;
    return getRelName(name);
};
const getChildren = function (parentPath, ignoreMDFiles = []) {
    const pattern = '/**/*.md';
    const files = glob.sync(parentPath + pattern).map((path) => {
        const newPath = path.slice(parentPath.length + 1, -3);
        if ((ignoreMDFiles === null || ignoreMDFiles === void 0 ? void 0 : ignoreMDFiles.length)
            && ignoreMDFiles.findIndex(item => item === newPath) !== -1) {
            return undefined;
        }
        return { path: newPath };
    });
    remove(files, file => file === undefined);
    // Return the ordered list of files, sort by 'path'
    return sortBy(files, ['path']).map(file => (file === null || file === void 0 ? void 0 : file.path) || '');
};
function side(baseDir, options) {
    glOptions = options;
    // const projectPath: string = process.env?.npm_config_local_prefix || '';
    const mdFiles = getChildren(baseDir, options === null || options === void 0 ? void 0 : options.ignoreMDFiles);
    const sidebars = [];
    mdFiles.forEach((item) => {
        var _a;
        const dirName = getDirName(item);
        if (((_a = options === null || options === void 0 ? void 0 : options.ignoreDirectory) === null || _a === void 0 ? void 0 : _a.length)
            && (options === null || options === void 0 ? void 0 : options.ignoreDirectory.findIndex(item => getDirName(item) === dirName)) !== -1) {
            return;
        }
        const mdFileName = getName(item);
        const sidebarItemIndex = sidebars.findIndex(sidebar => sidebar.text === dirName);
        const collapsible = options === null || options === void 0 ? void 0 : options.collapsible;
        let collapsed;
        if (!collapsible) {
            collapsed = undefined;
        }
        else {
            collapsed = options.collapsed;
        }
        if (sidebarItemIndex !== -1) {
            sidebars[sidebarItemIndex].collapsed = collapsed;
            sidebars[sidebarItemIndex].items.push({
                text: mdFileName,
                link: item,
            });
        }
        else {
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
const sideBar = (docDir = 'docs', options) => side(docDir, Object.assign({ pure: true }, options));

export { sideBar };
