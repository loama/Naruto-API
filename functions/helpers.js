const db = require('../db')

exports.result = function (req, res, status, result, detail, data) {
  let response = {
    result: result, // success or error
    detail: detail, // detail about the result "order created", "user logged in"
    data: data // json with the result
  }
  res.status(status).send(response)
}
