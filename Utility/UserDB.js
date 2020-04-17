var User = require('../models/User');
var UserItem = require('../models/UserItem');
var UserProfile = require('../models/UserProfile');
var mongoose = require('mongoose');
var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
//connecting with MongoDb
mongoose.connect('mongodb://localhost:27017/nbad',{useNewUrlParser: true});
var schema = mongoose.Schema;

//Defining schema for user
var userSchema = new schema({
  userId : {type: Number, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, requied: true},
  emailAddress : {type: String, requied: true}
},{collection:'users'});

//intializing mongoose model for mapping data
var userModel = mongoose.model('users', userSchema);

//Defining schema for user
var userProfileSchema = new schema({
  userId : {type: Number, required: true},
  itemCode:Number,
  itemName:String,
  catalogCategory:String,
  rating:String,
  yourItem:String
},{collection:'userProfile'});

//intializing mongoose model for mapping data
var userProfileModel = mongoose.model('userProfile', userProfileSchema);

//Retrieving all users in database
module.exports.getUsers = function(){
  return new Promise(resolve =>{
    resolve(userModel.find().then(function(d){
      return d;
    }));
  });
}

//Retrieving all userprofiles in database
module.exports.getUsersProfile = function(){
  return new Promise(resolve =>{
    resolve(userProfileModel.find().then(function(d){
      return d;
    }));
  });
}

//Retrieving user profile in database
module.exports.getUserProfile  = function(Id){
  return new Promise(resolve =>{
    resolve(userProfileModel.find({userId:Id}).then(function(d){
      return d;
    }));
  });
}

//Retrieving user in database
module.exports.getUser = function(email,password){
  return new Promise(resolve =>{
    resolve(userModel.findOne({emailAddress:email,password:password}).then(function(d){
      return d;
    }));
  });
}

//Adding userItem to user profile
module.exports.addItem = function(item,user){
  return new Promise(resolve =>{
    resolve(userProfileModel.find({userId:user.userId,itemCode:item.itemCode},function(err,d){
      if(d.length === 0){
        var temp = {
        userId :user.userId ,
        itemCode:item.itemCode,
        itemName:item.itemName,
        catalogCategory:item.catalogCategory,
        rating:item.rating,
        yourItem:"0"
        }
        var data = new userProfileModel(temp)
        data.save()
        return "yes";
      }
    })); 
  });
}

//Deleting userItem in user profile
module.exports.deleteItem = function(code,id){
  return new Promise(resolve =>{
    resolve(userProfileModel.findOneAndDelete({userId:id.userId,itemCode:code}).exec(function(err){
      return "yes";
    }));
  });
}

//Updating rating of userItem in user profile 
module.exports.updateRating = function(code,id,rate){
  return new Promise(resolve =>{
    resolve( userProfileModel.findOneAndUpdate({userId:id.userId,itemCode:code},{rating:rate}).exec(function(err){
      return "yes";
    }));
  });
}

//Updating flag of userItem in user profile
module.exports.updateFlag = function(code,id,you){
  return new Promise(resolve =>{
    resolve( userProfileModel.findOneAndUpdate({userId:id.userId,itemCode:code},{yourItem:you}).exec(function(err){
      return "yes";
    }));
  });
}
