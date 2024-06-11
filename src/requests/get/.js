module.exports = {
  init: (prefix, website) => {
    website.get(prefix, (request, response) => {
      if (!request.session.loggedin) {
        response.sendFile(`${__dirname.slice(0, -13)}/login.html`);
      }
    });
  },
};
