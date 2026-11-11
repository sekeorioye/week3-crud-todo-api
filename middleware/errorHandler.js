const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  console.error(err.message);
  console.log(err);
 const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: status
    }
  });
}
module.exports = errorHandler;