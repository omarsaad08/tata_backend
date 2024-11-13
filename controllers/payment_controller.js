const path = require('path');
const getSuccess = (req, res) => {
  res.sendFile(path.join(__dirname, '../screens/success.html'));
}
const getFail = (req, res) => {
  res.sendFile(path.join(__dirname, '../screens/fail.html'));
}
module.exports = {
  getSuccess,
  getFail
};