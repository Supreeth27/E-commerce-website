var express = require('express');
var router = express.Router();
var itemDb = require('../Utility/ItemDB');
var userDb = require('../Utility/UserDB');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({
  extended : false
});
var validator=require('express-validator');
router.use(validator());
const { check } = require('express-validator/check')

router.use(function(req, res, next){
  res.locals.fname = req.session.fname;
  next();
})

//route for displaying home page. 
router.get('/',  function(req, res) {
  if(req.session.theUser){
    res.render('index',{userProfile : req.session.userProfile, name: req.session.theUser});
  }
  else{
    res.render('index', {userProfile : null,name: null});
  }
});

//route for displsying userprofile
router.get('/myitems', function(req, res) {
  if(req.session.theUser){
    res.render('myitems', {userProfile : req.session.userProfile, name: req.session.theUser});
  }
  //Intializing session if user is not logged in
  else {
    //Retrieving users in database
    userDb.getUsers().then(function(users){
      req.session.theUser = users[0];
      userDb.getUserProfile(req.session.theUser.userId).then(function(userProfile){
        req.session.userProfile = userProfile;
        req.session.fname = users[0].firstName;
        res.render('myitems', {userProfile: req.session.userProfile, name: req.session.theUser,fname:req.session.fname});
      })
    })
  }
});

//route for displaying login page
router.get('/signin', function (req, res) {
  if(req.session.theUser){
    res.render('myitems', {userProfile : req.session.userProfile, name: req.session.theUser, flag: 0});
  }
  else{
    res.render('login', {userProfile : null, name: req.session.theUser, flag: 0});
  }
});

//Validating the details entered in login page with users present in database 
router.post('/signin',check('email').isEmail(),urlEncodedParser, function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  userDb.getUser(email,password).then(function(users){
    if(users){
      req.session.theUser = users
      //Intializing user profile for the user
      userDb.getUserProfile(req.session.theUser.userId).then(function(userProfile){
        req.session.userProfile = userProfile;
        req.session.fname = users.firstName;
        res.render('myitems',{userProfile:req.session.userProfile,name: req.session.theUser,fname:req.session.fname})
      });
    }
    else {
      res.render('login',{userProfile:null, flag:1});
    }
  });
});

//Destroying session if user logged out
router.get('/signout', function (req, res) {
  req.session.destroy();
  users = userDb.getUsers();
  userProfile = userDb.getUsersProfile();
  res.render('index', {userProfile : null, fname:undefined});
});

//route for displaying items page
router.get('/categories/catalog', async function(req, res) {
  //Retrieving categories from the function below
  var category = await getCategories();
  //Retrieving all items in database
  itemDb.getItems().then(function(itemdata){
    if(req.session.theUser){
      res.render('categories', {itemData :itemdata, category : category, userProfile : req.session.userProfile, name: req.session.theUser });
    }
    //if user not logged sending empty user profile
    else {
      res.render('categories', {itemData : itemdata, category : category, userProfile : null, name: null});
    }
  })
});

//route for displaying contact page
router.get('/contact', function(req, res) {
  if(req.session.theUser){
    res.render('contact', {userProfile : req.session.userProfile, name: req.session.theUser});
  }
  else {
    res.render('contact', {userProfile : null, name: null});
  }

});

//route for displaying about page
router.get('/about', function(req, res) {
  if(req.session.theUser){
    res.render('about', {userProfile : req.session.userProfile, name: req.session.theUser})
  }
  else {
    res.render('about', {userProfile : null, name: null});
  }   
});

//route for displaying item page
router.get('/categories/item/:itemCode', [check('itemCode').isNumeric()], async (req, res) => {
  const  itemCode = req.params.itemCode;
  var category = await getCategories();
  itemDb.getItems().then(function(itemdata){
    itemDb.getItem(itemCode).then(function(item){
      //if user is logged in
      if(req.session.theUser){
        //if item not present in database
        if(item === undefined){
          res.render('categories', {itemData : itemdata, category : category, userProfile : req.session.userProfile, name: req.session.theUser});
        }
        //if item present in database
        else {
          res.render('item', { item : item, userProfile : req.session.userProfile, name: null});
        }
      }
      //if user not logged in
      else {
        //if item not present in database
        if(item === undefined ){
          res.render('categories', {itemData : itemdata, category : category, userProfile : null, name: null});
        }
        //if item present in database
        else {
          res.render('item',{item: item, userProfile : null, name: null});
        }
      }
    })
  })
});

//adding userItem in user profile
router.get('/myitems/save', function(req, res) {
  var code = req.query.itemCode;
  var flag =0;
  //if user is logged in
  if(req.session.theUser){
    itemDb.getItem(code).then(function(item){
      if(item){
        //Calling add userItem method in Utility
        userDb.addItem(item,req.session.theUser).then(function(){
          //Retrieving user profile from database
          userDb.getUserProfile(req.session.theUser.userId).then(function(userProfile){
            req.session.userProfile = userProfile;
            res.render('myitems',{userProfile:req.session.userProfile, name: req.session.theUser});
          })
        })
      }
    });
  }
  //if user not logged in
  else {
    res.render('login', {userProfile : null, name: req.session.theUser, flag: 0});
  }
});

//deleting userItem in user profile
router.get('/myitems/delete', function(req, res) {
  var code = req.query.itemCode
  //if user is logged in
  if(req.session.theUser){
    //Calling delete userItem method in Utility
    userDb.deleteItem(code,req.session.theUser).then(function(a){
      //Retrieving user profile from database
      userDb.getUserProfile(req.session.theUser.userId).then(function(userProfile){
        req.session.userProfile = userProfile;
        res.render('myitems',{userProfile:req.session.userProfile, name: req.session.theUser});
      })
    })      
  }
  //if user not logged in
  else{
    res.render('login', {userProfile : null, name: req.session.theUser, flag: 0});
  }
});

//Routing to feedback page after clicking on update button
router.get('/myitems/feedback', function(req, res) {
  var code = req.query.itemCode;
  //if user is logged in
  if(req.session.theUser){
    //Retrieving item from database
    itemDb.getItem(code).then(function(item){
      //if item present in database
      if(item){
        res.render('feedback',{item:item, userProfile:req.session.userProfile, name: req.session.theUser});
      }
      //if item not present in database
      else {
        res.render('myitems',{userProfile:req.session.userProfile, name: req.session.theUser});
      }
    })
  }
  //if user not logged in
  else {
    res.render('login', {userProfile : null, name: req.session.theUser, flag: 0});
  }
});

//adding userItem in user profile
router.get('/myitems/updateRating', function(req, res) {
  var rating = req.query.rating;
  var code= req.query.itemCode;
  //if user is logged in
  if(req.session.theUser){
    //Checking if value of rating is valid or not
    if(rating >= 0 && rating <= 5 && rating != undefined){
      //Calling update userItem rating method in Utility
      userDb.updateRating(code,req.session.theUser,rating).then(function(err){
        //Retrieving user profile from database
        userDb.getUserProfile(req.session.theUser.userId).then(function(userProfile){
          req.session.userProfile = userProfile;
          res.render('myitems',{userProfile:req.session.userProfile, name: req.session.theUser});
        })
      })
    }
    else {
      res.render('myitems',{userProfile:req.session.userProfile, name: req.session.theUser});
    }
  }
  //if user not logged in
  else {
    res.render('login', {userProfile : null, name: req.session.theUser, flag: 0});
  }
});

//adding userItem in user profile
router.get('/myitems/updateFlag', function(req, res) {
  var yourItem = req.query.yourItem;
  var code= req.query.itemCode;
  //if user is logged in
  if(req.session.theUser){
    if((yourItem == 0 || yourItem == 1) && (yourItem != undefined)){
      //Calling update userItem flag method in Utility
      userDb.updateFlag(code,req.session.theUser,yourItem).then(function(err){
        //Retrieving user profile from database
        userDb.getUserProfile(req.session.theUser.userId).then(function(userProfile){
          req.session.userProfile = userProfile;
          res.render('myitems',{userProfile:req.session.userProfile, name: req.session.theUser});
        })
      })
    }
    else {
      res.render('myitems',{userProfile:req.session.userProfile, name: req.session.theUser});
    }
  }
  //if user not logged in
  else {
    res.render('login', {userProfile : null, name: req.session.theUser, flag: 0});
  }
});

//route for handling url's which are not present in application 
router.get('/*', function(req, res) {
  if(req.session.theUser){
    res.render('index', {userProfile : req.session.userProfile, name: req.session.theUser});
  }
  else {
    res.render('index', {userProfile : null, name: null});
  }
});

//Retrieving categories of connections
var getCategories = async function() {
  // get the category of each item
  var data = await itemDb.getItems();
  var categories = []
  data.forEach(function (item) {
    if(!categories.includes(item.catalogCategory)){
      categories.push(item.catalogCategory);
    }   
  });
  return categories;
};
module.exports = router;
