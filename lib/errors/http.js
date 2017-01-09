/**
 * HttpError
 *
 * @author John Rocela <jamoy@hooq.tv>
 */
export default
class HttpError extends Error {

  constructor(message, code, internal) {
    super(message, code);
    this.internal = internal;
    this.code = code;
    this.name = 'HttpError';
  }

}

