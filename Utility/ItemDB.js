var Item = require('../models/Item');
var mongoose = require('mongoose');

//connecting with MongoDb
mongoose.connect('mongodb://localhost:27017/nbad')
var Schema = mongoose.Schema;

//Defining schema for item
var itemSchema = new Schema({
    itemCode : Number,
    itemName : String,
    catalogCategory: String,
    description: String,
    rating: String,
    imageURL:String
},{collection:'itemDb'});

//intializing mongoose model for mapping data
var itemData = mongoose.model('itemDb',itemSchema);

//retrieving items from database
module.exports.getItems = function () {
  return new Promise(resolve =>{
    resolve(itemData.find().then(function(d){
      var items = [];
      for (let i = 0; i < d.length; i++) {
        var item = new Item(d[i].itemCode, d[i].itemName, d[i].catalogCategory, d[i].description, d[i].rating);
        item.imageURL = item.getImageURL(d[i].itemCode);
        items.push(item);
      }
      return items;
    }));
  });
};

//retrieving item from database
module.exports.getItem = function (itemC) {
  return new Promise(resolve =>{
    resolve(itemData.find({itemCode:itemC}).then(function(d){
      var item = new Item();
      if(d.length > 0){
        d[0].imageURL = item.getImageURL(d[0].itemCode);
      }
      return d[0];
    }));
  });
};
