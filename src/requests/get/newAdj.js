const func = require("../../static/func");
const url = require("url");

module.exports = {
  init: (prefix, website) => {
    website.get(`${prefix}newAdj`, (request, response) => {
      if (!request.session.vgc || !request.session.vgc.authenticated) {
        response.redirect(`${prefix}`);
      } else {
        func.connectToMySQL(response, (err, db) => {
          if (err) throw err;
          db.query("SELECT * FROM Gaming.AdjCodes", (err, results, fields) => {
            if (err) {
              response.send(func.sendError(err));
              return;
            }
            const query = url.parse(request.url, true).query;
            let entryID = 1;
            if (query.entryID) {
              entryID = query.entryID;
            }
            let reasonCodes = [];
            for (code in results) {
              reasonCodes.push([results[code].Code, results[code].Description])
            }
            reasonCodes = JSON.stringify(reasonCodes)
            response.render(`${__dirname.slice(0, -13)}/static/newAdj.html`, {
              entryID: entryID,
              reasonCodes: reasonCodes,
            });
          });
        });
      }
    });
  },
};
