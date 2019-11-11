var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')
var fileStore=require('session-file-store')(session);


//using passport
var passport=require('passport');
var authenticate=require('./authenticate');
var config=require('./config');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter=require('./routes/dishRouter');
var promoRouter=require('./routes/promoRouter');
var leaderRouter=require('./routes/leaderRouter');
var uploadRouter=require('./routes/uploadRouter')

//code to connect rest api with the database

const mongoose=require('mongoose');
const Dishes=require('./models/dishes');
// const url='mongodb://localhost:27017/conFusion';
const url=config.mongoUrl;
const connect=mongoose.connect(url);
connect.then((db)=>{
  console.log("connected correctly to the server")
},(err)=>{console.log("error found",err);});

//upto here connect to database

var app = express();
//for https
app.all('*',(req,res,next)=>{
  if(req.secure)
  {
    return next();
  }
  else{
    res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url);
  }
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
  app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//working with the authorization
//place where the autherization code is very important to first doing the auterization and then moving on to further code 
app.use(cookieParser('12345-67890-09876-54321'));

// function auth (req, res, next) {

//   if (!req.signedCookies.user) {
//     var authHeader = req.headers.authorization;
//     if (!authHeader) {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');              
//         err.status = 401;
//         next(err);
//         return;
//     }
//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var user = auth[0];
//     var pass = auth[1];
//     if (user == 'admin' && pass == 'password') {
//         res.cookie('user','admin',{signed: true});
//         next(); // authorized
//     } else {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');              
//         err.status = 401;
//         next(err);
//     }
//   }
//   else {
//       if (req.signedCookies.user === 'admin') {
//           next();
//       }
//       else {
//           var err = new Error('You are not authenticated!');
//           err.status = 401;
//           next(err);
//       }
//   }
// }

// app.use(auth);





//by using the express session


//SESSION 

// app.use(session({
//   name:'session-id',
//   secret:'12345-67890-09876-54321',
//   saveUninitialized:false,
//   resave:false,
//   store:new fileStore()
// }));

//using the passport for authentication
app.use(passport.initialize());
// app.use(passport.session());




app.use('/', indexRouter);
app.use('/users', usersRouter);


//using passport

//this is used to check at all places whether authenticated or not

// function auth (req, res, next) {
//       console.log(req.session);
//       //after authentication the passport middleware loads the req with the user object having properties
//     if(!req.user) {
//         var err = new Error('You are not authenticated!');
//         // res.setHeader('WWW-Authenticate','Basic');
//         err.status = 403;
//         return next(err);
//     }
//     else {
//     }
//     next(); 
//   }
  
//   app.use(auth);




//without using the passport



// function auth (req, res, next) {
//     console.log(req.session);
//   if(!req.session.user) {
//       var err = new Error('You are not authenticated!');
//       // res.setHeader('WWW-Authenticate','Basic');
//       err.status = 401;
//       return next(err);
//   }
//   else {
//     if (req.session.user === 'authenticated') {
//       next();
//     }
//     else {
//       var err = new Error('You are not authenticated!');
//       err.status = 403;
//       return next(err);
//     }
//   }
// }


//upto here authentication without using the passport





// app.use('/', indexRouter);
// app.use('/users', usersRouter);



// function auth (req, res, next) {
//   console.log(req.session);
//     if (!req.session.user) {
     
//       var err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');              
//       err.status = 401;
    
//       return   next(err);;
//     }
//     else {
//         if (req.session.user === 'authenticated') {
//             next();
//         }
//         else {
//             var err = new Error('You are not authenticated!');
//             err.status = 403;
//             next(err);
//         }
//     }
// }

// app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promo',promoRouter);
app.use('/leader',leaderRouter);
app.use('/imageUpload',uploadRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error  in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
