const func = require("../../static/func");

module.exports = {
  init: (prefix, website) => {
    website.engine("html", require("ejs").renderFile);
    website.get(prefix, (request, response) => {
      // func.debugOverride(request);
      if (!request.session.vgc || !request.session.vgc.authenticated) {
        response.sendFile(`${__dirname.slice(0, -13)}/static/login.html`);
      } else {
        func.connectToMySQL(response, (err, db) => {
          if (err) {
            response.send(func.sendError(err));
            return;
          }
          db.query(
            "SELECT * FROM Collection_db.Games",
            (err, results, fields) => {
              if (err) {
                response.send(func.sendError(err));
                response.end();
                return;
              }
              response.render(`${__dirname.slice(0, -13)}/static/home.html`, {
                username: request.session.vgc.username,
                totalGames: results.length,
              });
            }
          );
        });
      }
    });
  },
};
