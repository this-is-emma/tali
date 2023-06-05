// MODELS
const Item = require('../models/item');
const mailer = require('../utils/mailer');

// UPLOADING TO AWS S3
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const Upload = require('s3-uploader');

const client = new Upload(process.env.S3_BUCKET, {
  aws: {
    path: 'items/avatar',
    region: process.env.S3_REGION,
    acl: 'public-read',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  cleanup: {
    versions: true,
    original: true
  },
  versions: [{
    maxWidth: 400,
    aspect: '16:10',
    suffix: '-standard'
  },{
    maxWidth: 300,
    aspect: '1:1',
    suffix: '-square'
  }]
});


// ITEM ROUTES
module.exports = (app) => {

  // INDEX ITEM => index.js

  // NEW ITEM
  app.get('/items/new', (req, res) => {
    res.render('items-new');
  });

  // CREATE ITEM
  app.post('/items', upload.single('avatar'), (req, res, next) => {
    console.log(req.file)
    var item = new Item(req.body);
    item.save(function (err) {
      if (req.file) {
        // Upload the images
        client.upload(req.file.path, {}, function (err, versions, meta) {
          if (err) { return res.status(400).send({ err: err }) };
          // Pop off the -square and -standard and just use the one URL to grab the image
          versions.forEach(function (image) {
            var urlArray = image.url.split('-');
            urlArray.pop();
            var url = urlArray.join('-');
            item.avatarUrl = url;
            item.save();
          });

          res.send({ item: item });
        });
      } else {
        res.send({ item: item });
      }
    })
  })

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

  // SEARCH ITEM
  app.get('/search', function (req, res) {
    Item
      .find(
          { $text : { $search : req.query.term } },
          { score : { $meta: "textScore" } }
      )
      .sort({ score : { $meta : 'textScore' } })
      .limit(20)
      .exec(function(err, items) {
        if (err) { return res.status(400).send(err) }

        if (req.header('Content-Type') == 'application/json') {
          return res.json({ items: items });
        } else {
          return res.render('items-index', { items: items, term: req.query.term });
        }
      });
  });

  // PURCHASE
  app.post('/items/:id/purchase', (req, res) => {
    console.log(req.body);
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")(process.env.PRIVATE_STRIPE_API_KEY);

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express

    // req.body.itemId can become null through seeding,
    // this way we'll insure we use a non-null value
    let itemId = req.body.itemId || req.params.id;

    Item.findById(itemId).exec((err, item)=> {
      if (err) {
        console.log('Error: ' + err);
        res.redirect(`/items/${req.params.id}`);
      }
      const charge = stripe.charges.create({
        amount: item.price*100,
        currency: 'cad',
        description: `Purchased ${item.name}, ${item.type}`,
        source: token,
      }).then((chg) => {
        const user = {
          email: req.body.stripeEmail,
          amount: chg.amount / 100,
          itemName: item.name
        };
        // Call our mail handler to manage sending emails
        mailer.sendMail(user, req, res);
      })
      .catch(err => {
        console.log('Error:' + err);
      });
    })
  });
}
