"use strict";

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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

// const PetSchema = new Schema({
//     name            : { type: String, required: true }
//   , species         : { type: String }
//   , birthday        : { type: Date }
//   , picUrl          : { type: String }
//   , picUrlSq        : { type: String }
//   , favoriteFood    : { type: String }
//   , description     : { type: String }
// },
// {
//   timestamps: true
// });

module.exports = mongoose.model('item', ItemSchema);
