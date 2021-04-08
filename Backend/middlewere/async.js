module.exports = function(handler) { // Тази middleware ф-я служи да Wrap-ване на подадената Callback router ф-я, и я поставя в try catch блок. Това е с цел да се избегне повторението на try catch блока
    return async (req, res, next) => {
      try {
        await handler(req, res);
      } catch (ex) {
        next(ex);
      }
    };
  }
  