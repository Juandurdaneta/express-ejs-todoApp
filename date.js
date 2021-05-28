exports.getDate = function () {
  //This functions give us the complete date
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const today = new Date();
  today.setDate(today.getDate());

  return today.toLocaleDateString("en-US", options);
};

exports.getDay = function () {
  //  This function gives us only the day

  const options = {
    weekday: "long",
  };
  const today = new Date();
  today.setDate(today.getDate());

  return today.toLocaleDateString("en-US", options);
};
