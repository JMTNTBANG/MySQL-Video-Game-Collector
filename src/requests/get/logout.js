module.exports = {
    init: (prefix, website) => {
      website.get(`${prefix}logout`, (request, response) => {
        request.session.vgc = {
            authenticated: false,
            username: null,
            userid: null,
          };
        response.redirect("/")
      });
    },
  };
  