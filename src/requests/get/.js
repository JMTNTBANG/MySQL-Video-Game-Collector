const func = require("../../static/func");

module.exports = {
  init: (prefix, website) => {
    website.engine("html", require("ejs").renderFile);
    website.get(prefix, (request, response) => {
      // func.debugOverride(request);
      if (!request.session.vgc || !request.session.vgc.authenticated) {
        response.sendFile(`${__dirname.slice(0, -13)}/static/login.html`);
      } else {
        response.render(`${__dirname.slice(0, -13)}/static/home.html`, {
          username: request.session.vgc.username,
        });
      }
    });
  },
};
