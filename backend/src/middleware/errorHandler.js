// Basic Express error handling middleware
// Sends a generic error response for unhandled errors

module.exports = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};
