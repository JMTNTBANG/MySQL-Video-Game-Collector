const func = require("../../static/func.js");

module.exports = {
  init: (prefix, website) => {
    website.post(`${prefix}auth`, (request, response) => {
      const username = request.body.username;
      const password = request.body.password;
      console.log(`Authenticating ${request.ip} with Username ${username}`);
      const database = func.connectToMySQL();
      database.query(
        "SELECT * FROM auth.accounts WHERE username = ? AND password = ?",
        [username, password],
        (err, results, fields) => {
          if (err) throw err;
          if (results.length > 0) {
            console.log(
              `Successfully Authenticated ${request.ip} with Username ${username}`
            );
            request.session.vgc = {
              authenticated: true,
              username: username,
              userid: results[0].id,
            };
            response.redirect(prefix);
          } else {
            console.error(
              `Failed to Authenticate ${request.ip} with Username ${username}`
            );
            response.send(func.sendError("Incorrect Username and/or Password"));
          }
        }
      );
    });
  },
};
