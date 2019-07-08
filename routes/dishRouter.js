const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
// const express=require('express');
// const bodyParser=require('body-parser');
// const dishRouter=express.Router;
// dishRouter.use(bodyParser.json());
// dishRouter.route('/')
// //app removed since that will be handled by '/'
// .all((req,res,next)=>{
//     //'dishes' is also removed from it 
//     res.statusCode=200;
//     res.setHeader('Content-Type','text/plain');
//     next();//this is used to look for the further defined app function having the end point as /dishes looks for functions outside the });
// })  //colon removed
// .get((req,res,next)=>{
//     res.send('will send all the dishes resources to you'+' \n'+' you are in GET method');
//     //res.end('will send all the dishes to you');
// })
// .post((req,res,next)=>{
//     //here comes the use of bodyParser since it parse the incoming request information generally POST and PUT 
//     res.end('We will add the dish :=> '+req.body.name+'with details :=>'+req.body.description); 
// })
// put((req,res,next)=>{
//     //here comes the use of bodyParser since it parse the incoming request information generally POST and PUT
//     res.statusCode=403;//operation not supported
//     res.end('PUT operation not supported on /dishes'); 
// })
// delete((req,res,next)=>{
//     res.end('DELETING   all the dishes! ');

// });

// module.exports=dishRouter;

//Using the code given on online portal 

dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});



dishRouter.route('/:dishId')
//<<FOR '/dishes/:dishId>>>
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.send('will send you the dish =>'+req.params.dishId+' to you ');//at this positon the dishId is stored
})
.post((req,res,next)=>{
    res.statusCode=403;//operation not supported
    res.end(`POST method not supported on /dishes/${req.params.dishId}`); 
})
.put((req,res,next)=>{
    //here comes the use of bodyParser since it parse the incoming request information generally POST and PUT
    res.write('will update the dish with dishID =>'+req.params.dishId+'\n');
    //body-parsing the infromation from req.body part
    res.end('updating the dish name =>'+req.body.name+'with details =>'+req.body.description);
})
.delete((req,res,next)=>{
    res.end('DELETING   the dishe! =>'+req.params.dishId);

});

module.exports = dishRouter;