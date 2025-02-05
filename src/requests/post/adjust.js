const func = require("../../static/func.js");

module.exports = {
  init: (prefix, website) => {
    website.post(`${prefix}adjust`, (request, response) => {
      const entryID = request.body.entryID;
      const reasonCode = request.body.reasonCode;
      const amount = request.body.amount;
      const value = request.body.value;
      func.connectToMySQL(response, (err, db) => {
        if (err) throw err;
        db.query(
          "INSERT INTO `Gaming`.`Adjustments` (`EntryID`, `ReasonCode`, `Amount`, `ValuePer`) VALUES (?)",
          [[entryID, reasonCode, amount, value]],
          (err, result) => {
            if (err) {
              response.send(func.sendError(err));
              return;
            }
            response.send(`<script>window.location.pathname = "/collection"</script>`);
          }
        );
      });
    });
  },
};
