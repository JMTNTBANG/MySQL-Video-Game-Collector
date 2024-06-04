module.exports = {
  init: function init(prefix, website) {
    website.get(prefix, (request, response) => {
      response.send("Home");
    });
  },
};
