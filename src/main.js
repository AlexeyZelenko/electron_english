const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('fs').promises;

// Отключаем аппаратное ускорение
app.disableHardwareAcceleration();

// Создаем окно браузера
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
  console.log("process.env.NODE_ENV", process.env.NODE_ENV)

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // Для продакшн-сборки загружаем файл из скомпилированной папки
    const indexPath = path.join(__dirname, '../renderer/main_window/index.html');
    fs.stat(indexPath)
      .then(() => {
        mainWindow.loadFile(indexPath);
      })
      .catch((err) => {
        console.error('Failed to find index.html:', err);
      });
  }

  // Обработка ошибок при загрузке контента
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load content:', errorDescription);
  });

  // Логируем успешную загрузку окна
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Electron window loaded successfully');
  });

  // Обработка ошибок окна
  mainWindow.webContents.on('crashed', () => {
    console.error('The window has crashed');
  });
};

// Запуск Electron
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Закрытие приложения для всех платформ, кроме macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
