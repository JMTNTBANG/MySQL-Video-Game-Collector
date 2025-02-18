const func = require("../../static/func");
const url = require("url");

module.exports = {
  init: (prefix, website) => {
    website.get(`${prefix}details`, (request, response) => {
      if (!request.session.vgc || !request.session.vgc.authenticated) {
        response.redirect(`${prefix}?redirect=${encodeURIComponent(request.url.slice(1))}`);
      } else {
        let query = url.parse(request.url, true).query;
        if (!query.entryID) {
          response.render(`${__dirname.slice(0, -13)}/static/details.html`, {
            ID: "",
            TitleName: "",
            Platform: "",
            Publisher: "",
            ModelNo: "",
            Region: "",
            HasDisc: "",
            HasBox: "",
            HasManuals: "",
            HasOGLiner: "",
            IsGraded: "",
            UPC: "",
            PurchaseDate: "",
          });
        } else {
          func.connectToMySQL(response, (err, db) => {
            if (err) throw err;
            db.query(
              "SELECT * FROM Gaming.Entries WHERE `ID` = ?",
              [query.entryID],
              (err, results, fields) => {
                if (err) {
                  response.send(func.sendError(err));
                  return;
                }
                const entry = results[0];
                response.render(
                  `${__dirname.slice(0, -13)}/static/details.html`,
                  {
                    ID: entry.ID,
                    TitleName: entry.TitleName,
                    Platform: entry.Platform,
                    Publisher: entry.Publisher,
                    ModelNo: entry.ModelNo,
                    Region: entry.Region,
                    HasDisc: entry.HasDisc,
                    HasBox: entry.HasBox,
                    HasManuals: entry.HasManuals,
                    HasOGLiner: entry.HasOGLiner,
                    IsGraded: entry.IsGraded,
                    UPC: entry.UPC
                  }
                );
              }
            );
          });
        }
      }
    });
  },
};
