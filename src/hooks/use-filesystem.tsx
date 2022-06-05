import { DirectoryTypes } from "@typings/types";
import { createContext, FC, ReactChild, useContext, useMemo } from "react";
import { css, html, js } from "src/utils/fs/templates";
import { FileSystem } from "../utils/fs/filesystem";

const FileSystemContext = createContext(new FileSystem());

export const FileSystemProvider: FC<{ children: ReactChild }> = ({
  children,
}) => {
  const instance = useMemo(() => {
    const fs = new FileSystem();

    fs.init([
      fs.createFile({
        content: html.trim(),
        mimeType: "text/html",
        name: "index.html",
      }),
      fs.createFile({
        content: css.trim(),
        mimeType: "text/css",
        name: "styles.css",
      }),
      fs.createFile({
        content: js.main.trim(),
        mimeType: "text/javascript",
        name: "main.js",
      }),
      fs.createFile({
        content: js.app.trim(),
        mimeType: "text/javascript",
        name: "app.js",
      }),
    ]);

    return fs;
  }, []);

  return (
    <FileSystemContext.Provider value={instance}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  return useContext(FileSystemContext);
};
