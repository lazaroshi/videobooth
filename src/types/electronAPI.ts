import { VideoMetadata } from "./video";

export type ElectronAPI = {
  saveVideo: (videoBlob: ArrayBuffer, fileType: string) => void;
  getLibraryMetadata: () => Promise<VideoMetadata[]>;
  getVideo: (path: string) => Promise<Uint8Array>;
};
