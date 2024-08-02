import { IElectron } from "./types/electronAPI";

declare global {
  interface Window {
    electron: IElectron;
  }
}
