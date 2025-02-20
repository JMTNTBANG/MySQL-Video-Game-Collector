const mysql = require("mysql2");
const config = require("../config.json");

module.exports = {
  connectToMySQL: (response, callback) => {
    const db = mysql.createConnection({
      host: config.mysql.ip,
      port: config.mysql.port,
      user: config.mysql.username,
      password: config.mysql.password,
    });
    db.connect((err) => {
      if (err) {
        response.send('<script>alert("Interal Server Error"); history.back();</script>');
        response.end();
        if (err.errno == -3008) {
          console.error(
            `No SQL Server Found at ${config.mysql.ip}:${config.mysql.port}. Please update config.json.`
          );
          setTimeout(() => process.exit(1), 1000)
        } else if (err.code == "ETIMEDOUT") {
          console.error(
            `Connection to MySQL Server at ${config.mysql.ip}:${config.mysql.port} Timed Out, Please Confirm Host and Ports are Correct in config.json.`
          );
          setTimeout(() => process.exit(1), 1000)
        } else if (err.errno == 1045) {
          console.error(
            `Access Denied to MySQL Server at ${config.mysql.ip}:${config.mysql.port}, Please Confirm Username and Password are Correct in config.json.`
          );
          setTimeout(() => process.exit(1), 1000)
        } else callback(err, null)
      } else callback(null, db);
    });
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
