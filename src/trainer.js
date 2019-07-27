import { WEB_SOCKET_PORT } from './consts';
import data from './data';
import * as ui from './ui';

export function connectAsTrainer() {
  data.webSocket = new WebSocket(`ws://localhost:${WEB_SOCKET_PORT}`);

  data.webSocket.addEventListener('open', function() {
    data.webSocket.send(JSON.stringify({ type: 'identification', role: data.role, identification: data.identification }));
    ui.showMessage('Waiting for help requests...');
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

function sendNotificationThatHelpWasProvided() {
  // TODO
}

const trainerRoleWebSocketMessageHandlers = {
  'help-request': function(message) {
    ui.showMessage(`Student "${message.studentIdentification}" requested help!`);
    ui.showTrainerPanel();
  },
};

export function initializeTrainerPart() {
  ui.addEventListener('#help-provided-button', 'click', sendNotificationThatHelpWasProvided);
}
