export function responseHandler(req, res, next) {
  res.success = (data, message = "Success", statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      requestId: req.id,
    });
  };

  res.error = (message = "Error", statusCode = 400, data = null) => {
    res.status(statusCode).json({
      success: false,
      message,
      data,
      requestId: req.id,
    });
  };

  next();
}
