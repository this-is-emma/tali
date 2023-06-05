const Item = require('../models/item');

module.exports = (app) => {

  /* GET home page. */
  app.get('/', (req, res) => {
    const page = req.query.page || 1

    Item.paginate({}, { page: page }).then((results) => {
      // If the request is JSON, we want to send a JSON response
      if (req.header('Content-Type') == 'application/json') {
        return res.json({ items: results.docs, pagesCount: results.pages, currentPage: page });
      // Otherwise we do what we did before
      } else {
        res.render('items-index', { items: results.docs, pagesCount: results.pages, currentPage: page });
      }
    });
  });
}
