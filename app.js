var express = require('express');
var app = express();
var session = require('express-session');
var profileController = require('./routes/ProfileController.js');

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(session({
  secret : 'Supreeth',
  resave : false,
  saveUninitialized : true
}))

app.use('/', profileController);
//Hosting application in 8080 port
app.listen(8080,function(){
    console.log('listening on port 8080')
});

module.exports = app;