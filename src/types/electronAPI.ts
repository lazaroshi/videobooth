export interface IElectron {
  saveVideo: (videoBlob: ArrayBuffer, fileType: string) => void;
  getSavedVideos: () => Promise<string[]>;
}
