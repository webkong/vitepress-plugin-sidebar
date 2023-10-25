(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('path'), require('fs')) :
    typeof define === 'function' && define.amd ? define(['exports', 'path', 'fs'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.sidebar = {}, global.path, global.fs));
})(this, (function (exports, path, fs) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var glOptions;
    var prefixPath = '';
    var getRelName = function (name) {
        // "What-is-Vitepress" or "What_is_Vitepress" or "what_is_vitepress" -> "What is Vitepress"
        var readName = name.replace(/[-_]/g, ' ');
        // "01.xxx" -> "xxx"
        if (glOptions === null || glOptions === void 0 ? void 0 : glOptions.pure) {
            readName = readName.replace(/^\d+./, '');
        }
        return readName;
    };
    // handle md file name
    var getName = function (path$1) {
        var name = path$1.split(path.sep).pop() || path$1;
        name = name.slice(0, -3);
        // "Vuejs--What_is_vuejs" -> "What_is_vuejs"
        // const argsIndex = name.lastIndexOf('--');
        // if (argsIndex > -1) {
        //   name = name.substring(0, argsIndex);
        // }
        return getRelName(name);
    };
    // handle dir name
    var getDirName = function (path$1) {
        var name = path$1.split(path.sep).pop() || path$1;
        return getRelName(name);
    };
    var getUrlPath = function (path) { return path.split(prefixPath).pop(); };
    var getFiles = function (baseDir, options) {
        var fullPath = path.resolve(baseDir);
        var arr = [];
        // 递归遍历文件夹，获取所有文件
        fs.readdirSync(fullPath).forEach(function (item) {
            var _a, _b;
            // 直接跳过隐藏文件夹，如.git .vitepress
            if (item.indexOf('.') === 0) {
                return;
            }
            // 直接跳过忽略文件夹
            if (((_a = options === null || options === void 0 ? void 0 : options.ignoreDirectory) === null || _a === void 0 ? void 0 : _a.length)
                && (options === null || options === void 0 ? void 0 : options.ignoreDirectory.findIndex(function (ignorePath) { return item.indexOf(ignorePath) !== -1; })) > -1) {
                return;
            }
            var itemPath = "".concat(fullPath, "/").concat(item);
            var isDir = fs.statSync(itemPath).isDirectory();
            var collapsible = options === null || options === void 0 ? void 0 : options.collapsible;
            var collapsed;
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
                var dirName = getDirName(itemPath);
                arr.push({
                    text: dirName,
                    items: getFiles(itemPath, options),
                    collapsed: collapsed,
                });
            }
            // 如果是忽略的文件，直接跳过
            if (((_b = options === null || options === void 0 ? void 0 : options.ignoreMDFiles) === null || _b === void 0 ? void 0 : _b.length)
                && (options === null || options === void 0 ? void 0 : options.ignoreMDFiles.findIndex(function (ignorePath) { return getName(itemPath) === ignorePath; })) > -1) {
                return;
            }
            // 如果是markdown文件，放入数组中
            if (itemPath.indexOf('.md') > 0) {
                var fileName = getName(itemPath);
                arr.push({
                    text: fileName,
                    link: getUrlPath(itemPath),
                });
            }
        });
        return arr;
    };
    var getSidebar = function (baseDir, options) {
        glOptions = options;
        prefixPath = path.resolve(baseDir);
        var sidebarObject = getFiles(baseDir, options);
        return sidebarObject;
    };
    /**
     * @param   {String}    docDir   - Directory path, base on project docDir.
     * @param   {Options}    options   - Option to create configuration.
     */
    var sideBar = function (docDir, options) {
        if (docDir === void 0) { docDir = 'docs'; }
        return getSidebar(docDir, __assign({ pure: true }, options));
    };

    exports.sideBar = sideBar;

}));
