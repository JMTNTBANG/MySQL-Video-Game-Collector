const func = require("../../static/func");

module.exports = {
  init: (prefix, website) => {
    website.get(`${prefix}collection`, (request, response) => {
      if (!request.session.vgc || !request.session.vgc.authenticated) {
        response.redirect(`${prefix}`);
      } else {
        func.connectToMySQL(response, (err, db) => {
          if (err) throw err;
          db.query(
            "SELECT * FROM Collection_db.Games",
            (err, results, fields) => {
              if (err) {
                response.send(func.sendError(err));
                return;
              }
              let header = [];
              for (field in fields) {
                header.push(fields[field].name);
              }
              let data = []
              for (row in results) {
                let i = [];
                for (column in results[row]) {
                  i.push(results[row][column]);
                }
                data.push(i)
              }
              response.render(
                `${__dirname.slice(0, -13)}/static/collection.html`,
                {
                  username: request.session.vgc.username,
                  totalGames: results.length,
                  header: JSON.stringify(header),
                  data: JSON.stringify(data),
                }
              );
            }
          );
        });
      }
    });
  },
};
