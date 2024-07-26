import { VideoMetadata } from "./video";

export interface IElectron {
  saveVideo: (videoBlob: ArrayBuffer, fileType: string) => void;
  getLibraryMetadata: () => Promise<VideoMetadata[]>;
  getVideo: (path: string) => Promise<Uint8Array>;
}
