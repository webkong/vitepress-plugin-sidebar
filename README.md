Generator sidebar for [Vitepress](https://github.com/vuejs/vitepress) based on file and directory structure.

[![NPM version](https://img.shields.io/npm/v/vitepress-plugin-sidebar.svg)](https://www.npmjs.com/package/vitepress-plugin-sidebar) [![NPM downloads](https://img.shields.io/npm/dm/vitepress-plugin-sidebar.svg)](https://www.npmjs.com/package/vitepress-plugin-sidebar) [![NPM License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/webkong/vitepress-plugin-sidebar/blob/master/LICENSE)

# Install

```shell
npm install -D vitepress-plugin-sidebar
```

# API

## sideBar

```javascript
sideBar(docDir = './docs', options?: Options)
```

- **docDir**: `string` Directory to get configuration for, default is `docs`
- **options**: `Options`Option to create configuration

Options:

```typescript
interface Options {
  ignoreDirectory?: Array<string>; // Directoty path to ignore.
  ignoreMDFiles?: Array<string>; // File path to ignore.
  // If `true`, group is collapsible and collapsed by default
  // If `false`, group is collapsible but expanded by default
  collapsed?: boolean;
  // If not specified, group is not collapsible.
  collapsible?: boolean;
  // Default is true. Set false, will not remove number prefix, this options is for sort.
  // "01.xxx" -> "xxx"
  pure?: boolean;
}
```

# Usage

```javascript
import { sideBar } from "vitepress-plugin-sidebar";

module.exports = {
  // ...
  themeConfig: {
    // ...
    sidebar: sideBar(),
  },
};
```

## Ignore Some path

You can pass options to keep some path out of the sidebar.

```javascript
import { sideBar } from "vitepress-plugin-sidebar";

module.exports = {
  // ...
  themeConfig: {
    // ...
    sidebar: sideBar("docs", {
      ignoreMDFiles: ["index"],
      ignoreDirectory: ["node_modules"],
    }),
  },
};
```

## Open collapsed

```js
module.exports = {
  // ...
  themeConfig: {
    // ...
    sidebar: sideBar("docs", {
      ignoreMDFiles: ["index"],
      ignoreDirectory: ["node_modules"],
      collapsed: false,
      collapsible: true, 
    }),
  },
};
```

[The configuration for the sidebar in Vitepress](https://vitepress.vuejs.org/config/theme-configs#sidebar)

# License

MIT

Copyright (c) 2022-present, webkong
