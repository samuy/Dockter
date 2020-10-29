import { ipcMain, webContents } from 'electron';
import { StrictMode } from 'react';
import { db } from './db.ts';

const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});
const io = require('socket.io-client');

const socket = io('http://localhost:8080');

// socket.emit('initializeLogger');

ipcMain.on('ready', (event, arg) => {
  const content = webContents.getAllWebContents()[0];

  docker.listContainers((err, containers) => {
    containers.forEach((container) => {
      if (container.Names[0] !== '/dockter-log') {
        socket.emit('startLogCollection', container.Id);
      }
      const stmt = db.prepare(
        `INSERT OR IGNORE INTO containers (container_id, name, image, status, host_ip, host_port)
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      stmt.run(container.Id, container.Names[0], container.Image, container.Status, container.NetworkSettings.Networks.bridge.IPAddress, container.Ports[0].PublicPort)
    });
  });

  socket.on('newLog', (shippedLog) => {
    //TODO: Get most updated log shipper code
    //TODO: Investigate whether to handle logic for object structuring here or in Dockter Log Shipper
    const { containerId, log, time, stream } = shippedLog;
    const stmt = db.prepare(
      `INSERT INTO logs (container_id, message, timestamp, stream)
      VALUES (?, ?, ?, ?)`
    );
    stmt.run(containerId, log, time, stream);
    //TODO: Align column name and DB
    // shippedLog.container_id = containerId;
    content.send('shipLog', shippedLog);
  });
});
