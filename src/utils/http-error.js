class HttpError extends Error {
  constructor(status, message, opts = {}) {
    super(message);
    this.status = status;
  }
}

module.exports = HttpError;