module.exports = {
  init: (prefix, website) => {
    website.get(`${prefix}styles.css`, (request, response) => {
      response.sendFile(`${__dirname.slice(0, -13)}/static/styles.css`);
    });
  },
};
