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
    ignoreDirectory?: Array<string>;
    ignoreMDFiles?: Array<string>;
    collapsed?: boolean;
    collapsible?: boolean;
    pure?: boolean;
}
/**
 * @param   {String}    docDir   - Directory path, base on project docDir.
 * @param   {Options}    options   - Option to create configuration.
 */
export declare const sideBar: (docDir?: string, options?: Options) => SidebarGroup[];
export {};
