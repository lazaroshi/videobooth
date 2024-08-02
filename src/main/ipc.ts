import { ipcMain, app } from "electron";
import { VideoTypes } from "../types/video";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export const setupIpcHandlers = () => {
  ipcMain.handle("get-library-metadata", async () => {
    try {
      const files = await fs.promises.readdir(app.getPath("videos"));
      const videoFiles = files.filter((file) =>
        /\.(mp4|mkv|webm)$/i.test(file)
      );

      const metadataPromises = videoFiles.map(async (file) => {
        const filePath = path.join(app.getPath("videos"), file);
        const thumbnailData = await extractThumbnail(filePath);

        return {
          name: file,
          path: filePath,
          type: path.extname(file).slice(1) as VideoTypes,
          thumbnail: `data:image/png;base64,${thumbnailData.toString(
            "base64"
          )}`,
        };
      });

      const results = await Promise.allSettled(metadataPromises);

      const metadata = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => {
          if (result.status === "fulfilled") {
            return result.value;
          }
        });

      return metadata;
    } catch (error) {
      console.error("Error getting library metadata:", error);
    }
  });

  ipcMain.handle("get-video", async (event, videoPath) => {
    const filePath = path.join(app.getPath("videos"), videoPath);
    return fs.promises.readFile(filePath);
  });

  ipcMain.on("save-video", (event, videoBlob, mimeContainer) => {
    const timeStampedFileName = `${Date.now().toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    } as Intl.NumberFormatOptions)}.${mimeContainer}`;
    const filePath = path.join(app.getPath("videos"), timeStampedFileName);
    fs.writeFile(filePath, Buffer.from(new Uint8Array(videoBlob)), (err) => {
      if (err) {
        console.error("Failed to save video", err);
      } else {
        console.log("video saved ", filePath);
      }
    });
  });
};

export const extractThumbnail = (videoPath: string): Promise<Buffer> => {
  const thumbnailsDir = path.join(__dirname, "thumbnails");
  const thumbnailPath = path.join(
    thumbnailsDir,
    `${path.basename(videoPath)}.png`
  );

  // Ensure the thumbnails directory exists
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }

  // Check if the thumbnail already exists
  if (fs.existsSync(thumbnailPath)) {
    return fs.promises.readFile(thumbnailPath);
  }

  return new Promise<Buffer>((resolve, reject) => {
    ffmpeg(videoPath)
      .on("end", async () => {
        try {
          const data = await fs.promises.readFile(thumbnailPath);
          await fs.promises.unlink(thumbnailPath);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        reject(new Error(`FFmpeg error: ${error.message}`));
      })
      .screenshots({
        count: 1,
        folder: path.dirname(thumbnailPath),
        filename: path.basename(thumbnailPath),
        size: "320x240",
        timemarks: ["00:00:00.000"],
      });
  });
};
