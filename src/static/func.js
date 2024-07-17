const mysql = require("mysql");
const config = require("../config.json");

module.exports = {
  connectToMySQL: () => {
    const db = mysql.createConnection({
      host: config.mysql.ip,
      port: config.mysql.port,
      user: config.mysql.username,
      password: config.mysql.password,
    });
    db.connect((err) => {
      if (err) {
        response.send("Internal Server Error");
        response.end();
        if (err.errno == -3008) {
          console.error(
            `No SQL Server Found at ${config.mysql.ip}:${config.mysql.port}. Please update config.json.`
          );
        } else if (err.code == "ETIMEDOUT") {
          console.error(
            `Connection to MySQL Server at ${config.mysql.ip}:${config.mysql.port} Timed Out, Please Confirm Host and Ports are Correct in config.json.`
          );
        } else if (err.errno == 1045) {
          console.error(
            `Access Denied to MySQL Server at ${config.mysql.ip}:${config.mysql.port}, Please Confirm Username and Password are Correct in config.json.`
          );
        } else throw err;
      }
    });
    return db;
  },
  sendError: (error) => {
    return `<script>alert("${error}"); history.back();</script>`;
  },
  debugOverride: (request) => {
    request.session.vgc = {
      authenticated: true,
      username: "debug",
      userid: "-1",
    };
    console.warn(
      "Warning: Debug Override is Enabled, This is Only Recommended for Local Debugging"
    );
  },
};
