const Item = require('../models/item');

module.exports = (app) => {

  /* GET home page. */
  app.get('/', (req, res) => {
    Item.find().exec((err, items) => {
      res.render('items-index', { items: items });    
    });
  });
}
