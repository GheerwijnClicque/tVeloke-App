import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import { Board, Sensor } from 'johnny-five';
var five = require("johnny-five");
import * as url from 'url';
import { setInterval } from 'timers';
const now = require('performance-now');
const board = new Board({debug: true, repl: false});
const values = [];
const amount = 50;
const freq = 50; //ms
import { ReplaySubject } from 'rxjs';
const rpmUpdates = new ReplaySubject(1);

var valuesAll = [
  [],
  [],
  [],
  []
];

 // const board = new Board({debug: true, repl: false});
 board.on('ready', () => {
  // Initialize sensors
  var sensor1 = new five.Sensor({
    id: 0,
    pin: 7,
    type: 'digital',
    freq: freq
  });

  var sensor2 = new five.Sensor({
    id: 1,    
    pin: 8,
    type: 'digital',
    freq: freq
  });

  var sensor3 = new five.Sensor({
    id: 2,
    pin: 9,
    type: 'digital',
    freq: freq
  });

  var sensor4 = new five.Sensor({
    id: 3,
    pin: 10,
    type: 'digital',
    freq: freq
  });

  const sensors = [
    sensor1,
    sensor2,
    sensor3,
    sensor4
  ];

  
  /*   const sensor = new five.Sensor({
    pin: 7,
    type: 'digital',
    freq: freq
  });

  const sensor2 = new five.Sensor({
    pin: 7,
    type: 'digital',
    freq: freq
  }); */




  let test;

  rpmUpdates.subscribe((update: Object) => {
    console.log('update: ');
    console.log(update);
    if (test) {
      test.send('SendRpm',  update);
    }
  })

  sensor1.on('data', () => {
    getRPM(sensor1.value, sensor1.id);
  });
  sensor2.on('data', () => {
    getRPM(sensor2.value, sensor2.id);
  });
 /* sensor3.on('data', () => {
    getRPM(sensor3.value, sensor3.id);
  });
  sensor4.on('data', () => {
    getRPM(sensor4.value, sensor4.id);
  }); */
}); 

board.on('error', () => {
  console.log('error');
});

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');


if (serve) {
  require('electron-reload')(__dirname, {});
}

function getRPM(value, sensorId) {
  valuesAll[sensorId].push(value);
  if (valuesAll[sensorId].length > amount) {
    valuesAll[sensorId].splice(0, 1);

    let prevValue = valuesAll[sensorId][0];
    let sum = 1;
    let result = [];
    for (let i = 1; i < valuesAll[sensorId].length; i++) {
      if (valuesAll[sensorId][i] !== prevValue) {
        result.push(sum);
        sum = 1;
        prevValue = valuesAll[sensorId][i];
      } else {
        sum++;
      }
    }

    result.push(sum);

    var length = result.length;
    if (length === 1) {
      rpmUpdates.next({
        value: 0,
        sensor: sensorId
      });
    }
    else {
      let averageFreq = result.reduce((a, b) => {
        return a + b;
      }, 0) / length * freq * 2 / 1000;

      let rpm = 1 / averageFreq * 60;
      console.log('rpm: ' + rpm);
      rpmUpdates.next({
        value: Math.round(rpm),
        sensor: sensorId
      });
    }
  }
}



function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 300, //size.width
    height: 200 //size.height
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '/index.html'),
    slashes:  true
  }));

  // Open the DevTools.
  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
