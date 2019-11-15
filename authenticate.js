var passport=require('passport');
var localStrategy=require('passport-local').Strategy;
var User=require('./models/user')
//using passport jwt and jsonwebtoken


var JwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken');
//for facebook
facebookTokenStrategy=require('passport-facebook-token');
var config=require('./config');


//upto here using passport jwt and jsonwebtoken
exports.local=passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());  //for session based authorization
passport.deserializeUser(User.deserializeUser());   //for session based authorization

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
//normal authentication 
exports.verifyUser=passport.authenticate('jwt',{session:false})
//verifying as admin
exports.verifyAdmin=function(req,err,next){
    if(req.user.admin==true)
    next();
    else
    {
        err=new Error("You are not authorized to perform this operation!");
        err.statusCode=403;
        next(err);   
    }
}
// exports.verifySameUser=function(req,res,next){
//     res.send(res.user._id);
//     res.send(req.author);
//     console.log(res.user._id);
//     console.log(req.author);
    // if(req.user._id.equals(req.author._id))
    // next();
    // else
    // {
    //     err =new Error('You are not authorized to perform this operation!');
    //     err.statusCode=403;
    //     next(err);
    // }
// }
exports.facebookPassport=passport.use(new facebookTokenStrategy({
    clientID:config.facebook.clientId,
    clientSecret:config.facebook.clientSecret},(accesToken,refreshToken,profile,done)=>{
        User.findOne({facebookId:profile.id},(err,user)=>{
            if(err)
            {
                return done(err,false);
            }
            if(!err && user!=null)
            {
                return done(null,user)
            }
            else
            {

                //creating values for mongodb users 
                user = new User({ username: profile.displayName });
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if (err)
                        return done(err, false);
                    else
                        return done(null, user);
                })
            }
        })
    } 
))