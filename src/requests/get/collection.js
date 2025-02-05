const func = require("../../static/func");

module.exports = {
  init: (prefix, website) => {
    website.get(`${prefix}collection`, (request, response) => {
      if (!request.session.vgc || !request.session.vgc.authenticated) {
        response.redirect(`${prefix}`);
      } else {
        func.connectToMySQL(response, (err, db) => {
          if (err) throw err;
          db.query("SELECT * FROM Gaming.Entries", (err, results, fields) => {
            if (err) {
              response.send(func.sendError(err));
              return;
            }
            db.query(
              "SELECT * FROM Gaming.Adjustments",
              (err, adjustments, x) => {
                if (err) {
                  response.send(func.sendError(err));
                  return;
                }
                let hiddenColumns = [
                  "ID",
                  "TotalCost",
                  "TotalValue",
                  "HasDisc",
                  "HasBox",
                  "HasManuals",
                  "HasOGLiner",
                  "IsGraded",
                  "UPC",
                  "PurchaseDate",
                  "DateAdded",
                  "LastUpdated",
                ];
                let header = [];
                header.push("Actions", "Qty");
                for (field in fields) {
                  if (hiddenColumns.includes(fields[field].name)) continue;
                  header.push(fields[field].name);
                }
                let data = [];
                for (row in results) {
                  let qty = 0
                  for (adj in adjustments) {
                    if (adjustments[adj].EntryID == results[row].ID) {
                      qty += adjustments[adj].Amount
                    }
                  }
                  let i = []; 
                  i.push(`%ID%${results[row].ID}\\nDetails`, qty);
                  for (column in results[row]) {
                    if (hiddenColumns.includes(column)) continue;
                    i.push(results[row][column]);
                  }
                  data.push(i);
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
        });
      }
    });
  },
};
