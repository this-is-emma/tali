// MODELS
const Item = require('../models/item');

// ITEM ROUTES
module.exports = (app) => {

  // INDEX ITEM => index.js

  // NEW ITEM
  app.get('/items/new', (req, res) => {
    res.render('items-new');
  });

  // CREATE ITEM
  app.post('/items', (req, res) => {
    var item = new Item(req.body);

    item.save()
      .then((item) => {
        res.redirect(`/items/${item._id}`);
      })
      .catch((err) => {
        // Handle Errors
      }) ;
  });

  // SHOW ITEM
  app.get('/items/:id', (req, res) => {
    Item.findById(req.params.id).exec((err, item) => {
      res.render('items-show', { item: item });
    });
  });

  // EDIT ITEM
  app.get('/items/:id/edit', (req, res) => {
    Item.findById(req.params.id).exec((err, item) => {
      res.render('items-edit', { item: item });
    });
  });

  // UPDATE ITEM
  app.put('/items/:id', (req, res) => {
    Item.findByIdAndUpdate(req.params.id, req.body)
      .then((item) => {
        res.redirect(`/items/${item._id}`)
      })
      .catch((err) => {
        // Handle Errors
      });
  });

  // DELETE ITEM
  app.delete('/items/:id', (req, res) => {
    Item.findByIdAndRemove(req.params.id).exec((err, item) => {
      return res.redirect('/')
    });
  });
}
