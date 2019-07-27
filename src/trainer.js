import { WEB_SOCKET_PORT } from './consts';
import data from './data';
import * as ui from './ui';

export function connectAsTrainer() {
  data.webSocket = new WebSocket(`ws://localhost:${WEB_SOCKET_PORT}`);

  data.webSocket.addEventListener('open', function() {
    data.webSocket.send(JSON.stringify({ type: 'identification', role: data.role, identification: data.identification }));
    waitForHelpRequests();
  });

  data.webSocket.addEventListener('message', function(event) {
    const message = JSON.parse(event.data);
    (trainerRoleWebSocketMessageHandlers[message.type] || function() {})(message);
  });

  data.webSocket.addEventListener('close', function() {
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
  data.webSocket.send(JSON.stringify({ type: 'help-provided' }));
  ui.hideTrainerPanel();
  ui.showMessage('Sent confirmation...');
}

const trainerRoleWebSocketMessageHandlers = {
  'help-request': function(message) {
    ui.showMessage(`Student "${message.studentIdentification}" requested help!`);
    ui.showTrainerPanel();
  },
  'help-provided': function() {
    waitForHelpRequests();
  },
};

export function initializeTrainerPart() {
  ui.addEventListener('#help-provided-button', 'click', sendNotificationThatHelpWasProvided);
}
