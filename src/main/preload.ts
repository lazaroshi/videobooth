// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { ElectronAPI } from "../types/electronAPI";

const electronAPI: ElectronAPI = {
  saveVideo: (videoBlob: ArrayBuffer, fileType: string) =>
    ipcRenderer.send("save-video", videoBlob, fileType),
  getLibraryMetadata: () => ipcRenderer.invoke("get-library-metadata"),
  getVideo: (filePath: string) => ipcRenderer.invoke("get-video", filePath),
};

contextBridge.exposeInMainWorld("electron", electronAPI);
