module.exports = function (err, req, res, next) {//Тази middleware ф-я е отговорна за прихващане на Еррори. 
  res.status(500).send("Something failed");
};
