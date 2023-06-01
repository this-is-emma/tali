const Item = require('../models/item');

module.exports = (app) => {

  /* GET home page. */
  app.get('/', (req, res) => {
    Item.find().exec((err, items) => {
      res.render('pets-index', { items: items });    
    });
  });
}
