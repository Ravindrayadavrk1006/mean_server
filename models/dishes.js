// const timestamp=require('mongoose-timestamp');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//using the currency to declare the price of the dish
require('mongoose-currency').loadType(mongoose)
const Currency=mongoose.Types.Currency;


//currency upto here
const commentSchema=new Schema({
    rating:{
        type:Number,
        min:0,
        max:5,
        required:true,
    },
    comment:{
        type:String,
    },
    author:{
        type: String,
        required:true,
    }
},
    {
        timestamps:true,
});
const dishSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
    }  ,
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    label:{  //giving a label as hot 
        type:String,
        default:''
    },
    price:{
        type:Currency,
        required:true,
        min:0
    },
    featured:{
        type:Boolean,
        default:false,
    },

    comments:[commentSchema]
    //stores a array of comments of type commentSchema 
},{
    timestamps:true
});
var Dishes=mongoose.model("Dish",dishSchema);
module.exports=Dishes;