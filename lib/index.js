(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash/sortBy'), require('lodash/remove'), require('path'), require('glob')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash/sortBy', 'lodash/remove', 'path', 'glob'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.sidebar = {}, global.sortBy, global.remove, global.path, global.glob));
})(this, (function (exports, sortBy, remove, path, glob) { 'use strict';

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
        // "Vuejs--What_is_vuejs" -> "What_is_vuejs"
        // const argsIndex = name.lastIndexOf('--');
        // if (argsIndex > -1) {
        //   name = name.substring(0, argsIndex);
        // }
        return getRelName(name);
    };
    // handle dir name
    var getDirName = function (path$1) {
        var name = path$1.split(path.sep).shift() || path$1;
        return getRelName(name);
    };
    var getChildren = function (parentPath, ignoreMDFiles) {
        if (ignoreMDFiles === void 0) { ignoreMDFiles = []; }
        var pattern = '/**/*.md';
        var files = glob.sync(parentPath + pattern).map(function (path) {
            var newPath = path.slice(parentPath.length + 1, -3);
            if ((ignoreMDFiles === null || ignoreMDFiles === void 0 ? void 0 : ignoreMDFiles.length)
                && ignoreMDFiles.findIndex(function (item) { return item === newPath; }) !== -1) {
                return undefined;
            }
            return { path: newPath };
        });
        remove(files, function (file) { return file === undefined; });
        // Return the ordered list of files, sort by 'path'
        return sortBy(files, ['path']).map(function (file) { return (file === null || file === void 0 ? void 0 : file.path) || ''; });
    };
    function side(baseDir, options) {
        glOptions = options;
        // const projectPath: string = process.env?.npm_config_local_prefix || '';
        var mdFiles = getChildren(baseDir, options === null || options === void 0 ? void 0 : options.ignoreMDFiles);
        var sidebars = [];
        mdFiles.forEach(function (item) {
            var _a;
            var dirName = getDirName(item);
            if (((_a = options === null || options === void 0 ? void 0 : options.ignoreDirectory) === null || _a === void 0 ? void 0 : _a.length)
                && (options === null || options === void 0 ? void 0 : options.ignoreDirectory.findIndex(function (item) { return getDirName(item) === dirName; })) !== -1) {
                return;
            }
            var mdFileName = getName(item);
            var sidebarItemIndex = sidebars.findIndex(function (sidebar) { return sidebar.text === dirName; });
            var collapsible = options === null || options === void 0 ? void 0 : options.collapsible;
            var collapsed;
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
                    collapsed: collapsed,
                    items: [
                        {
                            text: mdFileName,
                            link: item,
                        },
                    ],
                });
            }
        });
        console.info('sidebar is create:', JSON.stringify(sidebars));
        return sidebars;
    }
    /**
     * @param   {String}    docDir   - Directory path, base on project docDir.
     * @param   {Options}    options   - Option to create configuration.
     */
    var sideBar = function (docDir, options) {
        if (docDir === void 0) { docDir = 'docs'; }
        return side(docDir, __assign({ pure: true }, options));
    };

    exports.sideBar = sideBar;

}));
