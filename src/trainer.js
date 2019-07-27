import { WEB_SOCKET_PORT } from './consts';
import data from './data';
import * as ui from './ui';

export function connectAsTrainer() {
  data.webSocket = new WebSocket(`ws://localhost:${WEB_SOCKET_PORT}`);

  data.webSocket.addEventListener('open', function() {
    data.webSocket.send(JSON.stringify({ type: 'identification', role: data.role, identification: data.identification }));
    ui.showMessage('Waiting for help requests...');
  });

  data.webSocket.addEventListener('close', function() {
    ui.showMessage('Disconnected...');
  });

  ui.showMessage('Connecting...');
}

function sendNotificationThatHelpWasProvided() {
  // TODO
}

export function initializeTrainerPart() {
  ui.addEventListener('#help-provided-button', 'click', sendNotificationThatHelpWasProvided);
}
