module.exports = {
    init: (prefix, website) => {
      website.get(`${prefix}assets`, (request, response) => {
        response.sendFile(`${__dirname.slice(0, -13)}/assets/${request.query.id}.png`);
      });
    },
  };
  