import { WEB_SOCKET_PORT } from './consts';
import data from './data';
import * as ui from './ui';

function handleStudentIdentificationInputChange() {
  const submitButton = document.querySelector('#student-identification-submit-button');
  const identification = document.querySelector('#student-identification-input').value;
  submitButton.disabled = !identification.trim();
}

function saveStudentIdentification() {
  data.identification = document.querySelector('#student-identification-input').value;
  ui.showHeader(`Student: ${data.identification}`);
  ui.hideStudentIdentificationForm();
  connectAsStudent();
}

function connectAsStudent() {
  data.webSocket = new WebSocket(`ws://localhost:${WEB_SOCKET_PORT}`);

  data.webSocket.addEventListener('open', function() {
    ui.showMessage('Connected!');
  });

  ui.showMessage('Connecting...');
}

function sendHelpRequest() {
  // TODO
}

export function initializeStudentPart() {
  ui.addEventListener('#student-identification-input', 'keyup',  handleStudentIdentificationInputChange);
  ui.addEventListener('#student-identification-form',  'submit', saveStudentIdentification);
  ui.addEventListener('#i-need-help-button',           'click',  sendHelpRequest);
}
