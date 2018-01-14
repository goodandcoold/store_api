
export default class BaseError extends Error {
  constructor (status = null, message = "", jsonMessage = null) {
      super(message);
       this.message = message;
       this.status = status;
       this.jsonMessage = jsonMessage;
  }
}
