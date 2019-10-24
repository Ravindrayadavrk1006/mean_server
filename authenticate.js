var passport=require('passport');
var localStrategy=require('passport-local').Strategy;
var User=require('./models/user')
//using passport jwt and jsonwebtoken


var JwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken');

var config=require('./config');



//upto here using passport jwt and jsonwebtoken
exports.local=passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//json web token from here <MORE>
//get token will be used for creating a web token
exports.getToken=function(user){
    //sign is used to create a jwt
    return jwt.sign(user,config.secretKey,{expiresIn:10000});
}
var opts={};
//in what way we will get jwt
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;
//checking for passport authentication ie jwt 
exports.jwtPassport=passport.use(new JwtStrategy(opts,
(jwt_payload,done)=>{
    console.log('JWT payload',jwt_payload);
    User.findOne({_id:jwt_payload._id},(err,user)=>{
        if(err)
            {return done(err,false)}
        else if(user)
        {
            return done(null,user)
        }
        else
        {
            //can also create a new user at this time
            return done(null);
        }
            
    })
}));
exports.verifyUser=passport.authenticate('jwt',{session:false})
