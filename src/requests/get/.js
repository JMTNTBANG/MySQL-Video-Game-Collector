module.exports = {
  init: (prefix, website) => {
    website.get(prefix, (request, response) => {
      if (!request.session.vgc || !request.session.vgc.authenticated) {
        response.sendFile(`${__dirname.slice(0, -13)}/static/login.html`);
      } else {
        response.send(`Logged in as ${request.session.vgc.username}`);
      }
    });
  },
};
