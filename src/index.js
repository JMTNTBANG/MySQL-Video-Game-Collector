const fs = require("fs");
const http = require("http");
const https = require("https");

const express = require("express");
const session = require("express-session");

const config = require("./config.json");

function init(prefix = "/", website = undefined) {
  if (!module.parent) {
    website = express();
  }
  website.use(
    session({ secret: "secret", resave: true, saveUninitialized: true })
  );
  website.use(express.json());
  website.use(express.urlencoded({ extended: true }));
  website.use(express.static(`${__dirname}static`));

  for (const getRequest of fs.readdirSync(`${__dirname}/requests/get/`)) {
    require(`${__dirname}/requests/get/${getRequest}`).init(prefix, website);
  }
  for (const postRequest of fs.readdirSync(`${__dirname}/requests/post/`)) {
    require(`${__dirname}/requests/post/${postRequest}`).init(prefix, website);
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
        .listen(config.port.https, () => {
          console.log(`HTTPS Server running on port ${config.port.https}`);
        });
    } catch {
      console.warn("Caution: Connections will not be secured");
    }
    http.createServer(website).listen(config.port.http, () => {
      console.log(`HTTP Server running on port ${config.port.http}`);
    });
  }
}

module.exports = { init: init };
if (!module.parent) init();
