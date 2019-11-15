var mongoose =require('mongoose');
var Schema=mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose');
var User=new Schema({
  // these two fileds username and password itself added automtically using passportLocalMongoose 



  // username:{
  //   type:String,
  //   required:true,
  // },
  // password:{
  //   type:String,
  //   required:true,

  // },
  firstname:{
    type:String,
    default:'',
  },
  lastname:{
    type:String,
    default:'',
  },
  facebookId:String,
  admin:{
    type:Boolean,
    default:false,
  }
});

User.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',User);
