// npm run make -- --platform=win32
// npm run make -- --platform=darwin
// npm run make -- --platform=linux
// npm run make

const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    executableName: 'my-dictionary',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: "MyDictionary",
        authors: "Infinity",
        exe: "my_dictionary.exe",
        setupExe: "MyDictionary.exe",
        setupIcon: path.resolve(__dirname, "assets/icons/icon.ico"),
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: "MyDictionary",
        title: "MyDictionary Installer",
        icon: path.resolve(__dirname, "assets/icons/icon.icns"),
        background: path.resolve(__dirname, "assets/dmg-background.png"),
        overwrite: true,
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        bin: 'my-dictionary',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        bin: 'my-dictionary',
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'src/main.js',
            config: 'vite.main.config.mjs',
            target: 'main',
          },
          {
            entry: 'src/preload.js',
            config: 'vite.preload.config.mjs',
            target: 'preload',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
