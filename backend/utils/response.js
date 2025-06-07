export const sendResponse = (res, status = 500, message = '', data = null) => {
  const success = status >= 200 && status < 300;
  return res.status(status).json({ success, message, data });
};

