const func = require("../../static/func.js");

module.exports = {
  init: (prefix, website) => {
    website.post(`${prefix}saveEntry`, (request, response) => {
      const ID = request.body.ID;
      let sql = {
        TitleName: request.body.TitleName,
        Platform: request.body.Platform,
        Publisher: request.body.Publisher,
        ModelNo: request.body.ModelNo,
        Region: request.body.Region,
        UPC: request.body.UPC,
        PurchaseDate: request.body.PurchaseDate,
      };
      const bools = {
        HasDisc: request.body.HasDisc,
        HasBox: request.body.HasBox,
        HasManuals: request.body.HasManuals,
        HasOGLiner: request.body.HasOGLiner,
        IsGraded: request.body.IsGraded,
      };
      for (bool in bools) {
        if (bools[bool] == "on") {
          sql[bool] = 1;
        } else if (!bools[bool]) {
          sql[bool] = 0;
        }
      }
      func.connectToMySQL(response, (err, db) => {
        if (err) throw err;
        if (!ID) {
          db.query(
            "INSERT INTO `Gaming`.`Entries` (`TitleName`, `Platform`, `Publisher`, `ModelNo`, `Region`, `HasDisc`, `HasBox`, `HasManuals`, `HasOGLiner`, `IsGraded`, `UPC`, `PurchaseDate`) VALUES (?)",
            [[
              sql.TitleName,
              sql.Platform,
              sql.Publisher,
              sql.ModelNo,
              sql.Region,
              sql.HasDisc,
              sql.HasBox,
              sql.HasManuals,
              sql.HasOGLiner,
              sql.IsGraded,
              sql.UPC
            ]],
            (err, result) => {
              if (err) {
                response.send(func.sendError(err));
                return;
              }
              response.send(`<script>window.close()</script>`);
            }
          );
        } else {
          db.query("UPDATE `Gaming`.`Entries` SET ? WHERE (`ID` = ?);", [sql, ID],
            (err, result) => {
              if (err) {
                response.send(func.sendError(err));
                return;
              }
              response.send(`<script>window.close()</script>`);
            });
        }
      });
    });
  },
};
