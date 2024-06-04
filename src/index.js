const fs = require("fs");
const http = require("http");
const https = require("https");

const express = require("express");
const session = require("express-session");

function init(prefix = undefined, website = undefined) {
  if (!module.parent) {
    website = express();
  }
  website.use(
    session({ secret: "secret", resave: true, saveUninitialized: true })
  );
  website.use(express.json());
  website.use(express.urlencoded({ extended: true }));
  website.use(express.static(path.join(__dirname, "static")));

  for (const getRequest of fs.readdirSync(`${__dirname}/requests/get/`)) {
    let request = require(`${__dirname}/requests/get/${getRequest}`);
    request.init(prefix, website);
  }
  for (const postRequest of fs.readdirSync(`${__dirname}/requests/post/`)) {
    let request = require(`${__dirname}/requests/post/${postRequest}`);
    request.init(prefix, website);
  }
  if (!module.parent) {
    try {
      https
        .createServer(
          {
            key: fs.readFileSync(`${config.ssl}/privkey.pem`, "utf8"),
            cert: fs.readFileSync(`${config.ssl}/cert.pem`, "utf8"),
            ca: fs.readFileSync(`${config.ssl}/chain.pem`, "utf8"),
          },
          website
        )
        .listen(443, () => {
          console.log("HTTPS Server running on port 443");
        });
    } catch {
      console.log("Caution: Connections will not be secured");
    }
    http.createServer(website).listen(8080, () => {
      console.log("HTTP Server running on port 8080");
    });
  }
}

module.exports = { init: init };
if (!module.parent) init();
