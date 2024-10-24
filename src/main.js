const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('fs').promises;

// Отключаем аппаратное ускорение
app.disableHardwareAcceleration();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== 'undefined') {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else if (typeof MAIN_WINDOW_VITE_NAME !== 'undefined') {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  } else {
    console.error('Unable to load URL or file. Check environment variables.');
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load content:', errorDescription);
  });
};

// Handle file export
ipcMain.handle('export-file', async (event, { content, extension }) => {
  try {
    const options = {
      title: 'Save File',
      defaultPath: `~/words.${extension}`,
      filters: [{ name: extension.toUpperCase(), extensions: [extension] }]
    };

    const { canceled, filePath } = await dialog.showSaveDialog(null, options);
    if (!canceled && filePath) {
      await fs.writeFile(filePath, content);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error saving file:', err);
    throw new Error('Failed to save file');
  }
});

// The play-audio logic is moved to the renderer process
// When Electron is initialized
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
