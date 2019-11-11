const express=require('express');
const cors=require('cors');
const app=express();


//dependincies of cors
const whitelist=['http://localhost:3000','htpps://localhost:3443'];
var corsOptionsDelegate=(req,callback)=>{
    var corsOptions;

    //means the origin is present
    if(whitelist.indexOf(req.header('Origin'))!==-1)
    {
        corsOptions={origin:true};   
    }
    else
    {
        corsOptions={origin:false};
    }
    callback(null,corsOptions);
}
exports.cors=cors();
exports.corsWithOptions=cors(corsOptionsDelegate);