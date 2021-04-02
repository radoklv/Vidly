module.exports = function isAdmin(req, res, next) {
  //Тази middleware ф-я е нужно да се изпълни след Auth middleware ф-ята
  if (!req.user.isAdmin) {
    return res.status(403).send("Access denied");
  }

  next();
};
