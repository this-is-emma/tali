const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const Item = require('../models/item');

const teresa =     {
  "_id": "aaaaaaaaaaaa",
  "name": "teresa",
  "type": "earring",
  "picUrl": "some_url",
  "picUrlSq": "some_url",
  "price": 3.49,
  "description": "A golden earring with pendants",
  "color": "blue",
  "tag": "almost_sold_out",
  "productCode": "TER-001"
}

chai.use(chaiHttp);

describe('Items', ()  => {

  after(() => { 
    Item.deleteMany({$or: [{name: 'Julia'}, {name: 'Anna'}] }).exec((err, items) => {
      console.log(items, `Deleted ${items.n} documents`)
    }) 
  });

  // TEST INDEX
  it('should index ALL items on / GET', (done) => {
    chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
  });

  // TEST NEW
  it('should display new form on /items/new GET', (done) => {
    chai.request(server)
      .get(`/items/new`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html
          done();
        });
  });
  
  // TEST CREATE 
  it('should create a SINGLE item on /items POST', (done) => {
    chai.request(server)
        .post('/items')
        .send(teresa)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html
          done();
        });
  });

  // TEST SHOW
  it('should show a SINGLE item on /items/<id> GET', (done) => {
    var item = new Item(teresa);
     item.save((err, data) => {
       chai.request(server)
         .get(`/items/${data._id}`)
         .end((err, res) => {
           res.should.have.status(200);
           res.should.be.html
           done();
         });
     });

  });

  // TEST EDIT
  it('should edit a SINGLE item on /items/<id>/edit GET', (done) => {
    var item = new Item(teresa);
     item.save((err, data) => {
       chai.request(server)
         .get(`/items/${data._id}/edit`)
         .end((err, res) => {
           res.should.have.status(200);
           res.should.be.html
           done();
         });
     });
  });


  // TEST UPDATE
  it('should update a SINGLE item on /items/<id> PUT', (done) => {
    var item = new Item(teresa);
    item.save((err, data)  => {
     chai.request(server)
      .put(`/items/${data._id}?_method=PUT`)
      .send({'name': 'Julia'})
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html
        done();
      });
    });
  });

  // TEST DELETE
  it('should delete a SINGLE item on /items/<id> DELETE', (done) => {
    var item = new Item(teresa);
    item.save((err, data)  => {
     chai.request(server)
      .delete(`/items/${data._id}?_method=DELETE`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html
        done();
      });
    });
  });


  // SEARCH
  it('should search ALL items by name on /search GET', (done) => {
    chai.request(server)
        .get('/search?term=teresa')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
  });

  // API Endpoint
  it('should list ALL items on /items GET', function(done) {
    chai.request(server)
        .get('/')
        .set('content-type', 'application/json')
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          done();
        });
  });
});