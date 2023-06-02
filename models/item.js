"use strict";

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
  limit: 6 // how many records on each page
};

const ItemSchema = new Schema({
    name            : { type: String, required: true }
  , type            : { type: String, required: true } //earring ? Necklace? bracelet?
  , picUrl          : { type: String, required: true }
  , picUrlSq        : { type: String, required: true }
  , avatarUrl       : { type: String, required: true }
  , price           : { type: String, required: true }
  , description     : { type: String, required: true, minlength: 100 }
  , color           : { type: String, required: true }
  , productCode     : { type: String, required: true } 
},
{
  timestamps: true
});

ItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('item', ItemSchema);
