const codeMessages = {
  200: 'The server successfully returned the requested data. ',
  201: 'New or modified data is successful. ',
  202: 'A request has entered the background queue (asynchronous task). ',
  204: 'The data was deleted successfully. ',
  400: 'The request returned an error and the server did not perform any new or modified data operations. ',
  401: 'User does not have permission (token, username, or password is incorrect). ',
  403: 'The user is authorized, but access is forbidden. ',
  404: 'The request was made for a record that does not exist. ',
  406: 'The format of the request is not available. ',
  410: 'The requested resource is permanently deleted and will not be retrieved. ',
  422: 'A validation error occurred when creating an object. ',
  500: 'An error occurred on the server. Please check the server. ',
  502: 'Gateway error. ',
  503: 'The service is unavailable and the server is temporarily overloaded or maintained. ',
  504: 'The gateway timed out. ',
};

const getAlertMessage = status => {
  return codeMessages[status];
};

export default getAlertMessage;
