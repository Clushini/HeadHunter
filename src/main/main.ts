/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable promise/param-names */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint global-require: off, no-console: off, promise/always-return: off */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, protocol, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
const request = require('request');
const port = 4001;
const cookie = require('cookie');
const WebSocket = require('ws');
const http = require('http');
const https = require('https')
const server = http.createServer();
const { Server } = require("socket.io");
const ncp = require("copy-paste");
const fs = require('fs');
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const appserver = express();
const cors = require('cors');

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:4002',
  clientID: '',
  issuerBaseURL: '',
  secret: '',
  clientSecret: "",
  routes: {
    postLogoutRedirect: '/custom-logout'
  }
};

let userData = {}

appserver.use(cors());
appserver.use(auth(config));

appserver.get('/custom-logout', (req, res) => {
  session.defaultSession.clearStorageData({storages: ['cookies']})
  .then(() => {
    mainWindow.loadURL("http://localhost:4002/login");
  })
  .catch((error) => {
      console.error('Failed to clear cookies: ', error);
  });
})

appserver.get('/', (req, res) => {
  userData = req.oidc.user;

  if (req.oidc.isAuthenticated()) {
    mainWindow.loadURL(resolveHtmlPath('index.html'));
  }
  else {
    mainWindow.loadURL("http://localhost:4002/login");
  }
});

appserver.get('/cookies', (req, res) => {
  session.defaultSession.cookies.get({})
  .then((cookies) => {
    let ck = null;
    cookies.map(cookie => {
      if (cookie.name === "appSession") {
        ck = cookie;
      }
    })
    if (!ck) {
      mainWindow.loadURL("http://localhost:4002/login");
    }
  }).catch((error) => {
    console.log(error)
  })
})

appserver.get('/loggedin', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'loggedin' : 'loggedout');
});

appserver.get('/profile', (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

appserver.get('/getLeagues/:POESESSID?', async (req, res) => {
  let POESESSID = req.params.POESESSID;
  let leagueData = await getLeagueData(POESESSID);
  res.send(leagueData);
})

appserver.listen(4002, () => {
  console.log("appserver listening on 4002")
})

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
});

ipcMain.on('close-btn', () => {
  BrowserWindow.getFocusedWindow().close();
})

ipcMain.on('min-btn', () => {
  BrowserWindow.getFocusedWindow().minimize();
})

ipcMain.on('max-btn', () => {
  if (BrowserWindow.getFocusedWindow().isMaximized()) {
    BrowserWindow.getFocusedWindow().unmaximize();
  }
  else {
    BrowserWindow.getFocusedWindow().maximize();
  }
})

// app.use(cors());

// let currentLeague = "Scourge";

const getLeagueData = (POESESSID: any) => new Promise(function(success, nosuccess) {
  let options_https = {
      Cookie: `POESESSID=${POESESSID}`,
      origin: "www.pathofexile.com",
      headers: {
          'Cookie': cookie.serialize('POESESSID', POESESSID),
          'POESESSID': POESESSID,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
          // 'cf_clearance': "KSY4V9.149OUxYTkM2DB8dFGIbqft26ZJyCU1leIZoI-1642826680-0-150"
      }
  }

  https.get(`https://www.pathofexile.com/api/league`, options_https, (res) => {
      let chunks = [];
      res.on("data", d => {
          chunks.push(d)
      }).on('end', () => {
          let data = Buffer.concat(chunks);
          let test = JSON.parse(data);
          success(test);
      })
  })
});

const getItemData = (id: any, POESESSID: any) => new Promise(function(success, nosuccess) {
    let options_https = {
        Cookie: `POESESSID=${POESESSID}`,
        origin: "www.pathofexile.com",
        headers: {
            'Cookie': cookie.serialize('POESESSID', POESESSID),
            'POESESSID': POESESSID,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
            // 'cf_clearance': "KSY4V9.149OUxYTkM2DB8dFGIbqft26ZJyCU1leIZoI-1642826680-0-150"
        }
    }

    https.get(`https://www.pathofexile.com/api/trade/fetch/${id}`, options_https, (res) => {
        let chunks = [];
        res.on("data", d => {
            chunks.push(d)
        }).on('end', () => {
            let data = Buffer.concat(chunks);
            let test = JSON.parse(data);
            success(test);
        })
    })
});

io.on('connection', (socket) => {
    let websocketConnections = {}
    let settings = {
        autoClipboard: false,
        notifications: true,
        sounds: true
    }

    const userDataPath = app.getPath('userData');
    const filePath = `${userDataPath}/LiveSearchManagerState.json`;

    try { 
      if (fs.existsSync(filePath)) {
        const rawdata = fs.readFileSync(filePath);
        const parsed = JSON.parse(rawdata);
        parsed.userData = userData;
        socket.emit("setInitialState", parsed)
      }
    } catch (err) {
      console.log(err)
    }

    Object.keys(settings).map(setting => {
        socket.emit("updateSetting", setting, settings[setting])
    })

    socket.on("saveState", (settingsJson) => {
      fs.writeFile(`${userDataPath}/LiveSearchManagerState.json`, settingsJson, (err, result) => {
        if (err) console.log('error: ', err);
      });
    })

    socket.on("updateSetting", (setting, value, isPremium) => {
      // if (isPremium && userData['http://localhost:4002/data/premium']) {
      //   settings[setting] = value;
      //   socket.emit("updateSetting", setting, settings[setting])
      // }
      // if (!isPremium) {
      //   settings[setting] = value;
      //   socket.emit("updateSetting", setting, settings[setting])
      // }
      settings[setting] = value;
      socket.emit("updateSetting", setting, settings[setting])
    })

    socket.on("getDefaultSettings", () => {
        Object.keys(settings).map(setting => {
            socket.emit("updateSetting", setting, settings[setting])
        })
    });

    socket.on("disconnect", () => {
      Object.keys(websocketConnections).map(code => {
        websocketConnections[code].close();
      })
    })

    socket.on("stream", (code, action, POESESSID, league) => {
        if (action === "start") {
            websocketConnections[code] = new WebSocket(
                `ws://www.pathofexile.com/api/trade/live/${league}/${code}`,
                [], {
                    origin: `http://www.pathofexile.com/api/trade/live/${league}/${code}`,
                    "POESESSID": POESESSID,
                    'headers': {
                        'Cookie': cookie.serialize('POESESSID', POESESSID),
                        'POESESSID': POESESSID,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
                    }
                }
            );

            websocketConnections[code].on('message', async function message(data) {
                let item = JSON.parse(data);
                if (item.new) {
                    let itemId = item.new[0];
                    let itemData = await getItemData(itemId, POESESSID);
                    let result = itemData.result[0].listing.whisper
                    if (settings.autoClipboard) {
                        ncp.copy(result)
                    }
                    socket.emit("resultFound", code, itemData)
                }
            });

            websocketConnections[code].on('open', function open() {
                socket.emit("opened", code, league);
            });

            websocketConnections[code].on('close', function open() {
                socket.emit("closed", code);
            });
        }

        if (action === "stop") {
            websocketConnections[code].close()
        }
    })
})

server.listen(port, async () => {
    console.log(`LiveSearch Manager Listening on http://localhost:${port}`)
})

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  // console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment = true;

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};



const createWindow = async () => {
  await installExtensions();

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 1450,
    minHeight: 900,
    icon: getAssetPath('icon.png'),
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
    
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    session.defaultSession.clearStorageData({storages: ['cookies']})
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const filter = {
  urls: ["http://localhost:1213/*"]
};

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
