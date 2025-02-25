const func = require("../../static/func.js");

module.exports = {
  init: (prefix, website) => {
    website.post(`${prefix}adjust`, (request, response) => {
      if (!request.session.vgc || !request.session.vgc.authenticated) {
        response.redirect(`${prefix}`);
      } else {
        const entryID = request.body.entryID;
        const reasonCode = request.body.reasonCode;
        const amount = request.body.amount;
        const value = request.body.value;
        let datePurchased = request.body.PurchaseDate;
        if (datePurchased == "") {
          datePurchased = null;
        }
        func.connectToMySQL(response, (err, db) => {
          if (err) throw err;
          db.query(
            "INSERT INTO `Gaming`.`Adjustments` (`EntryID`, `ReasonCode`, `Amount`, `ValuePer`, `DatePurchased`) VALUES (?)",
            [[entryID, reasonCode, amount, value, datePurchased]],
            (err, result) => {
              if (err) {
                response.send(func.sendError(err));
                return;
              }
              response.send(`<script>window.close()</script>`);
            }
          );
        });
      }
    });
  },
};
