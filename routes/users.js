var express=require('express');
const bodyParser=require('body-parser');
var User=require('../models/user')
var authenticate=require('../authenticate')
//for passport
var passport=require('passport');

//corse module for resource sharing
const cors=require('./cors');
var Usersrouter=express.Router();
Usersrouter.use(bodyParser.json());

/* GET users listing. */
Usersrouter.get('/',cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then((users)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(users);

},(err)=>next(err))
.catch((err)=>next(err));;
});

Usersrouter.post('/signup',cors.corsWithOptions,function(req,res,next){
//using passport
  User.register(new User({username: req.body.username}),
    req.body.password,(err,user)=>{
    if (err)
    {
      res.statusCode=500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err})//this will tell the type of error whether a user with that username is already present or not
    }
    else
    {
      if(req.body.firstname)
      {
        user.firstname=req.body.firstname;
      }
      if(req.body.lastname)
      {
        user.lastname=req.body.lastname
      }
      user.save((err,user)=>{
        if(err)
        {
          res.statusCode=500;
          res.setHeader('Content-Type','application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req,res,()=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({success:true,status:'Registration Succesfull! '});
      });
      });
    }
  });
});

//this is using express session and cookies basic authentication



//   User.findOne({username: req.body.username})
//   .then((user)=>{
//     if (user!=null)
//     {
//       var err=new Error('User'+req.body.username+' already exist');
//       err.status=403;
//       next(err);
//     }
//     else
//     {
//       return User.create({
//         username:req.body.username,
//         password:req.body.password,
//       });
//     }

//   })
//   .then((user)=>{
//     res.statusCode=200;
//     res.setHeader('Content-Type','application/json');
//     res.json({status:'Registration Succesfull! ',user:user});
//   },(err)=>{next(err)})
//   .catch((err)=>{
//     next(err)
//   })
// });


Usersrouter.post('/login',cors.corsWithOptions,passport.authenticate('local'),(req,res)=>{
  //this is checking the username and password using the passport.authenticate and the this function is called on basis of being succesfull or error raised
  
  //CREATING A TOKEN FOR BEING USED AS JWT AUTHENTICATION 
  var token=authenticate.getToken({_id:req.user._id})
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  //token send alongside the succes message
  res.json({success:true,status:'You are succesfully logged in',token:token,});
});


//part of login authentication

//   if (!req.session.user) {
//     var authHeader = req.headers.authorization;
//     if (!authHeader) {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');              
//         err.status = 401;
//         return  next(err);
//     }
//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var username = auth[0];
//     var password = auth[1];
//     User.findOne({username:username,password:password})
//     .then((user)=>{
//       if(user===null){
//         var err = new Error('User '+username+' does not exist!');           
//         err.status = 403;
//         return next(err);
//       }
//       else if(user.password!==password)
//       {
//         var err = new Error("Wrong password!");           
//         err.status = 403;
//         return next(err);
//       }
//       else if (user.username === username && user.password === password) {
//         req.session.user = 'authenticated';
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('You are authenticated!')
//       }
//     })
//     .catch((err)=>next(err)); 
//   }
//   else
//   {
//     res.statusCode=200;
//     res.setHeader('Content-Type','text/plain');
//     res.end('You are already authenticated!');
//   }
// });



Usersrouter.get('/logout',cors.corsWithOptions,(req,res,next)=>{
  if(req.session)
  {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/'); //redirectiong to a partiular page
  }
  else
  {
    var err=new Error('You are not logged in!');
    err.status=403;
    next(err);
  }
});











// var express = require('express');
// const bodyParser=require('body-parser');
// var User=require('../models/user')
// var Usersrouter = express.Router();
// /* GET users listing. */
// Usersrouter.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// Usersrouter.post('/signup', (req, res, next) => {
//   User.findOne({username: req.body.username})
//   .then((user) => {
//     if(user != null) {
//       var err = new Error('User ' + req.body.username + ' already exists!');
//       err.status = 403;
//       next(err);
//     }
//     else {
//       return User.create({
//         username: req.body.username,
//         password: req.body.password});
//     }
//   })
//   .then((user) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({status: 'Registration Successful!', user: user});
//   }, (err) => next(err))
//   .catch((err) => next(err));
// });

// Usersrouter.post('/login', (req, res, next) => {

//   if(!req.session.user) {
//     var authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//       var err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
  
//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var username = auth[0];
//     var password = auth[1];
  
//     User.findOne({username: username})
//     .then((user) => {
//       if (user === null) {
//         var err = new Error('User ' + username + ' does not exist!');
//         err.status = 403;
//         return next(err);
//       }
//       else if (user.password !== password) {
//         var err = new Error('Your password is incorrect!');
//         err.status = 403;
//         return next(err);
//       }
//       else if (user.username === username && user.password === password) {
//         req.session.user = 'authenticated';
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('You are authenticated!')
//       }
//     })
//     .catch((err) => next(err));
//   }
//   else {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('You are already authenticated!');
//   }
// })

// Usersrouter.get('/logout', (req, res) => {
//   if (req.session) {
//     req.session.destroy();
//     res.clearCookie('session-id');
//     res.redirect('/');
//   }
//   else {
//     var err = new Error('You are not logged in!');
//     err.status = 403;
//     next(err);
//   }
// });
// // Usersrouter.post('/signup',function(req,res,next){
// //   User.findOne({username:req.body.username})
// //   .then((user)=>{
// //     if(user)
// //     {
// //     var err=new Error(`${req.body.username} already exist`);
// //     err.status=403;
// //     next(err);
// //     }
// //     else
// //     {
// //       return User.create({
// //         username:req.body.username,
// //         password:req.body.password,
// //       })
// //     }

// //   })
// //   .then((user)=>{
// //     res.statusCode=200;
// //     res.setHeader('Content-Type','application/json');
// //     res.json({status:'Registration Successfull ! ',user:user})
// //   },err=>{next(err)})
// //   .catch((err)=>{next(err)});
// // })
// // Usersrouter.post('/login',(req,res,next)=>{
// //   if (!req.session.user) {
// //     var authHeader = req.headers.authorization;
// //     if (!authHeader) {
// //         var err = new Error('You are not authenticated!');
// //         res.setHeader('WWW-Authenticate', 'Basic');              
// //         err.status = 401;
// //         next(err);
// //         return;
// //     }
// //     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
// //     var user = auth[0];
// //     var pass = auth[1];
// //     User.findOne({username:username})
// //     .then(user=>{
// //       if(user==null)
// //       {
// //         var err=new Error('no such error like '+username);
// //         err.status=403;
// //         return next(err);
// //       }
// //       else if(user.password!=password)
// //       {
// //         var err=new Error('Your password is incorrect');
// //         err.status=403;
// //         return next(err);
// //       }
// //       else if (user.username ==username && user.password == password) {
// //         req.session.user='authenticated'
// //         res.statusCode=200;
// //         res.setHeader('Content-Type','text/plain');
// //         res.end('You are authenticated!');
// //         next(); // authorized
// //     }
// //   })
// //   .catch(err=>{next(err)});
// // }
// //   else
// //   {
// //     res.statusCode=200;
// //     res.setHeader('Content-Type','text/plain');
// //     res.end('You are already authenticated')
      
// //   }
 
// //     });   
// // Usersrouter.get('/logout',(req,res,next)=>{
// //   if(req.session)
// //   {
// //     req.session.destroy();
// //     res.clearCookie('session-id')
// //     res.redirect('/')
// //   }
// //   else
// //   {
// //     var err=new Error('You are not logged in ')
// //     err.status=403;
// //     next(err);
// //   }
// // });
 module.exports = Usersrouter;
