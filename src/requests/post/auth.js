module.exports = {
    init: (prefix, website) => {
      website.post(prefix, (request, response) => {
        const username = request.body.username
        const password = request.body.password
      });
    },
  };
  