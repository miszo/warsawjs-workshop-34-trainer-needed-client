import socketIO from 'socket.io-client';
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
  data.webSocket = socketIO.connect(`ws://localhost:${WEB_SOCKET_PORT}`);

  data.webSocket.on('connect', function() {
    data.webSocket.emit('identification', { role: data.role, identification: data.identification });
    ui.hideMessage();
    ui.showStudentPanel();
  });

  data.webSocket.on('position-in-waiting-queue', function(message) {
    ui.showMessage(`All trainers are busy at the moment, your position in the waiting queue: ${message.positionInWaitingQueue}`);
  });

  data.webSocket.on('trainer-assigned', function() {
    ui.showMessage('A trainer will approach you in a second...');
  });

  data.webSocket.on('help-provided', function() {
    ui.hideMessage();
    ui.showStudentPanel();
  });

  data.webSocket.on('reconnecting', function() {
    ui.hideStudentPanel();
    ui.showMessage('Reconnecting...');
  });

  data.webSocket.on('disconnect', function() {
    ui.hideStudentPanel();
    ui.showMessage('Disconnected...');
  });

  ui.showMessage('Connecting...');
}

function sendHelpRequest() {
  data.webSocket.emit('help-request');
  ui.hideStudentPanel();
  ui.showMessage('Sent help request...');
}

export function initializeStudentPart() {
  ui.addEventListener('#student-identification-input', 'keyup',  handleStudentIdentificationInputChange);
  ui.addEventListener('#student-identification-form',  'submit', saveStudentIdentification);
  ui.addEventListener('#i-need-help-button',           'click',  sendHelpRequest);
}
