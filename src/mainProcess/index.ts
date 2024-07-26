import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 700,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.setAspectRatio(8 / 7);
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const getVideoFilePaths = (): string[] => {
  const videoDirPath = path.join(app.getPath("videos"));
  if (!fs.existsSync(videoDirPath)) {
    return [];
  }
  const isValidFileRegex =
    /^(?:[a-zA-Z]:\\)?(?:[\w\- ]+\\)*[\w\- ]+\.[a-zA-Z0-9]+$/;
  return fs
    .readdirSync(videoDirPath)
    .filter((file) => isValidFileRegex.test(file))
    .map((file) => path.join(videoDirPath, file));
};

ipcMain.handle("get-saved-videos", () => {
  const videos = getVideoFilePaths();
  return videos;
});

ipcMain.on("save-video", (event, videoBlob, mimeContainer) => {
  const filePath = path.join(
    app.getPath("videos"),
    `${Date.now().toLocaleString("en-US")}.${mimeContainer}`
  );
  fs.writeFile(filePath, Buffer.from(new Uint8Array(videoBlob)), (err) => {
    if (err) {
      console.error("Failed to save video", err);
    } else {
      event.reply("video-saved", filePath);
    }
  });
});
