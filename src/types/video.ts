export type VideoTypes = "mp4" | "mkv" | "webm";

export type VideoMetadata = {
  name: string;
  path: string;
  type: VideoTypes;
  thumbnail: string;
};
