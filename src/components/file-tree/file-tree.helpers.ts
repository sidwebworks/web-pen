import { getLanguage } from "src/lib";

export enum FileIcons {
  javascript = "javascript",
  typescript = "typescript",
  html = "html",
  css = "css",
  markdown = "markdown",
  document = "document",
}

export enum FolderIcons {
  src = "folder-src",
  public = "folder-public",
  folder = "folder",
  components = "folder-components",
  lib = "folder-lib",
  styles = "folder-styles",
}

export function getIcon(
  name: string,
  isFile: boolean = false
): FileIcons | FolderIcons {
  if (isFile) {
    const lang = getLanguage(name);
    return FileIcons[lang] || FileIcons["document"];
  }

  return FolderIcons[name] || FolderIcons["folder"];
}
