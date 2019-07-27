import socketIO from 'socket.io-client';
import { WEB_SOCKET_PORT } from './consts';
import data from './data';
import * as ui from './ui';

export function connectAsTrainer() {
  data.webSocket = socketIO.connect(`ws://localhost:${WEB_SOCKET_PORT}`);

  data.webSocket.on('connect', function() {
    data.webSocket.emit('identification', { role: data.role, identification: data.identification });
    waitForHelpRequests();
  });

  data.webSocket.on('help-request', function(message) {
    ui.showMessage(`Student "${message.studentIdentification}" requested help!`);
    ui.showTrainerPanel();
  });

  data.webSocket.on('help-request-cancellation', function() {
    waitForHelpRequests();
  });

  data.webSocket.on('help-provided', function() {
    waitForHelpRequests();
  });

  data.webSocket.on('reconnecting', function() {
    ui.hideTrainerPanel();
    ui.showMessage('Reconnecting...');
  });

  data.webSocket.on('disconnect', function() {
    ui.hideTrainerPanel();
    ui.showMessage('Disconnected...');
  });

  ui.showMessage('Connecting...');
}

function waitForHelpRequests() {
  ui.hideTrainerPanel();
  ui.showMessage('Waiting for help requests...');
}

function sendNotificationThatHelpWasProvided() {
  data.webSocket.emit('help-provided');
  ui.hideTrainerPanel();
  ui.showMessage('Sent confirmation...');
}

export function initializeTrainerPart() {
  ui.addEventListener('#help-provided-button', 'click', sendNotificationThatHelpWasProvided);
}
