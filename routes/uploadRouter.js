const express = require('express');
const bodyParser = require('body-parser');   
const authenticate=require('../authenticate');
const uploadRouter = express.Router();
const multer=require('multer');
//using multer for pics upload
//corse module for resource sharing
const cors=require('./cors');
//where to store
var storage=multer.diskStorage({
    destination:(req,file,callbackfun)=>{
        callbackfun(null,'public/images');//here images will be stored
    },
    filename:(req,file,callbackfun)=>{
        callbackfun(null,file.originalname)//with the original name
    },
})
//image type filter
//cb is callback function
const imageFileFilter=(req,file,cb)=>{
    //specifying file type being uploaded
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image file'))
    }
    cb(null,true);
};
//calling multer to be used with the properties defined above
const upload=multer({storage:storage,fileFilter:imageFileFilter});
uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('GET operation not supported on /imageUpload')
})
//hanling the upload router
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile'),(req,res)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('GET operation not supported on /imageUpload')
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('GET operation not supported on /imageUpload')
})
module.exports=uploadRouter;  