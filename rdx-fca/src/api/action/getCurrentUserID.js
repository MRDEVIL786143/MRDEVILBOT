module.exports = function(api) {
  return function() {
    return api._userID || null;
  };
};
module.exports.credits = "MR DEVIL";
