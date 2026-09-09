const ok = (res, message, data = {}, statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const created = (res, message, data = {}) => ok(res, message, data, 201);

module.exports = { ok, created };
