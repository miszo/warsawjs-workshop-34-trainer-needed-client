import * as ui from './ui';

export function connectAsTrainer() {
  // TODO
}

function sendNotificationThatHelpWasProvided() {
  // TODO
}

export function initializeTrainerPart() {
  ui.addEventListener('#help-provided-button', 'click', sendNotificationThatHelpWasProvided);
}
