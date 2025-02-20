const func = require("../../static/func");
const package = require("../../../package.json");

module.exports = {
  init: (prefix, website) => {
    website.get(`${prefix}stats`, (request, response) => {
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
                let gameamt = {}
                let platamt = {}
                let gameval = {}

                let unique = 0
                let total = 0
                let platform = ''
                let expensive = ''
                let value = 0

                for (adj in adjustments) {
                    let i = adjustments[adj]
                    if (!gameamt[i.EntryID]) gameamt[i.EntryID] = 0
                    gameamt[i.EntryID] += i.Amount
                    if (!gameval[i.EntryID]) gameval[i.EntryID] = 0
                    gameval[i.EntryID] = i.ValuePer
                    total += i.Amount
                    value += i.ValuePer
                }
                for (entry in gameamt) {
                    if (gameamt[entry] > 0) {
                        unique += 1
                    }
                }
                for (entry in results) {
                    let i = results[entry]
                    if (!platamt[i.Platform]) platamt[i.Platform] = 0
                    platamt[i.Platform] += 1
                }
                platamt2 = []
                for (plat in platamt) {
                    platamt2.push({name: plat, amt: platamt[plat]})
                }
                platamt2.sort((a, b) => b.amt - a.amt)
                for (plat of platamt2) {
                    platform = `${plat.name} - ${plat.amt} Games`
                    break;
                }
                gameval2 = []
                for (game in gameval) {
                    gameval2.push({name: game, amt: gameval[game]})
                }
                gameval2.sort((a, b) => b.amt - a.amt)
                for (game of gameval2) {
                    expensive = `${results[game.name-1].TitleName} - $${game.amt}`
                    break;
                }

                response.render(
                  `${__dirname.slice(0, -13)}/static/stats.html`,
                  {
                    version: package.version,
                    username: request.session.vgc.username,
                    unique: unique,
                    total: total,
                    platform: platform,
                    expensive: expensive,
                    value: value
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
