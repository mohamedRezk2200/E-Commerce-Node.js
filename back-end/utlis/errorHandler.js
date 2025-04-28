export const errorHandler = (err, req, res, next) => {
 res.status(err.statusCode || 500).send({
  statusCode: err.statusCode || 500,
  requestStatus: err.requestStatus || 'failed',
  message: err.message,
  data: null,
 });
};
 