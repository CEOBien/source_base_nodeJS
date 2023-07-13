const isValidDate = (dateString) => {
  var regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  var parts = dateString.split("-");
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);
  if (year < 1000 || year > 3000 || month == 0 || month > 12) {
    return false;
  }
  var maxDay = 31;
  if (month == 4 || month == 6 || month == 9 || month == 11) {
    maxDay = 30;
  } else if (month == 2) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      maxDay = 29;
    } else {
      maxDay = 28;
    }
  }
  return day > 0 && day <= maxDay;
};

module.exports = isValidDate;
