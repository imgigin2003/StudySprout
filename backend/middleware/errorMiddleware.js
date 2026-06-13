const errorHandler = (err, req, res, next) => {
  // Determine the status code: if it's currently 200 (OK), we change it to 500 (Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // We only show the stack trace if we are not in production mode for security reasons
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
