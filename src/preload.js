// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

// Экспортируем методы для рендер-процесса через contextBridge
contextBridge.exposeInMainWorld('api', {
  invoke: (channel, data) => {
    const validChannels = ['export-words', 'import-words', 'play-audio', 'export-file'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  },
  receive: (channel, callback) => {
    const validChannels = ['export-complete', 'import-complete'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  // playAudio: (word) => {
  //   const utterance = new SpeechSynthesisUtterance(word);
  //   utterance.lang = 'en-US';
  //   window.speechSynthesis.speak(utterance);
  // },
  saveFile: (content, extension) => ipcRenderer.invoke('export-file', { content, extension })
});