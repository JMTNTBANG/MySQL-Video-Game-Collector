const func = require("../../static/func");

module.exports = {
  init: (prefix, website) => {
    website.get(`${prefix}getItems`, (request, response) => {
      func.connectToMySQL(response, (err, db) => {
        if (err) throw err;
        db.query(
          "SELECT * FROM `Gaming`.`Entries`",
          (err, result, fields) => {
            if (err) throw err;
            response.send(result)
          }
        );
      });
    });
  },
};
