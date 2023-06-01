"use strict";

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
  limit: 6 // how many records on each page
};

const ItemSchema = new Schema({
    name            : { type: String, required: true }
  , type            : { type: String } //earring ? Necklace? bracelet?
  , picUrl          : { type: String }
  , picUrlSq        : { type: String }
  , price           : { type: String }
  , description     : { type: String }
  , color           : { type: String }
  , productCode     : { type: String } 
},
{
  timestamps: true
});

ItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('item', ItemSchema);
