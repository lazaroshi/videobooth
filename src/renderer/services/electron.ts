import { VideoTypes } from "../../types/video";

export const sendVideoToElectron = (videoBlob: Blob, container: VideoTypes) => {
  videoBlob.arrayBuffer().then((buffer) => {
    window.electron.saveVideo(buffer, container);
  });
};

export const getVideoMetadataFromElectron = async () => {
  return window.electron.getLibraryMetadata();
};

export const getVideoURLFromElectron = async (
  fileName: string,
  fileType: VideoTypes
) => {
  const videoData = await window.electron.getVideo(fileName);
  const blob = new Blob([videoData], { type: `video/${fileType}` });
  return URL.createObjectURL(blob);
};
