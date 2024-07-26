// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { IElectron } from "../types/electronAPI";

contextBridge.exposeInMainWorld("electron", {
  saveVideo: (videoBlob: ArrayBuffer, fileType: string) =>
    ipcRenderer.send("save-video", videoBlob, fileType),
  getLibraryMetadata: () => ipcRenderer.invoke("get-library-metadata"),
  getVideo: () => ipcRenderer.invoke("get-video"),
} as IElectron);
