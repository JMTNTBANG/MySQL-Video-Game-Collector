const func = require("../../static/func");
const package = require("../../../package.json");

module.exports = {
  init: (prefix, website) => {
    website.get(`${prefix}collection`, (request, response) => {
      if (!request.session.vgc || !request.session.vgc.authenticated) {
        response.redirect(`${prefix}?redirect=${encodeURIComponent(request.url.slice(1))}`);
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
                  "UPC",
                  "PurchaseDate",
                  "DateAdded",
                  "LastUpdated",
                ];
                let header = [];
                header.push("Actions", "Qty", "Includes");
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
                  let iconCode = 0
                  if (results[row].HasDisc == 1) {
                    iconCode += 1;
                  } 
                  if (results[row].HasBox == 1) {
                    iconCode += 2
                  }
                  if (results[row].HasManuals == 1) {
                    iconCode += 4
                  }
                  if (results[row].HasOGLiner == 1) {
                    iconCode += 8
                  }
                  i.push(`%IMG%${iconCode}\\n`)
                  for (column in results[row]) {
                    if (hiddenColumns.includes(column)) continue;
                    i.push(results[row][column]);
                  }
                  data.push(i);
                }
                response.render(
                  `${__dirname.slice(0, -13)}/static/collection.html`,
                  {
                    version: package.version,
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
