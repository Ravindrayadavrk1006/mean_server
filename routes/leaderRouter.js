const express=require('express');
const bodyParser=require('body-parser');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());

//defining the working of leader
leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end(`will send all the leaders to you`);
})
.post((req,res,next)=>{
    res.end('adding a new leader with'+req.body.name+'with the description'+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;//not found
    res.end('cant perform '+req.method+'operation on leader');
})
.delete((req,res,next)=>{
    res.end('deleting all the leader from the leader page');
});



//LEADER ID
leaderRouter.route('/:leaderId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
})
.get((req,res,next)=>{
    res.write('Hi There!!!');
    res.end(`sending all the information of leader with id ${req.params.leaderId}`);
})
.post((req,res,next)=>{
    res.statusCode=403;//can't perform this opration
    res.end('can\'t perform this operation');
})
.put((req,res,next)=>{
    res.end(`making changes to ${req.params.leaderId} with the name ${req.body.name} with description ${req.body.description}`);
})
.delete((req,res,next)=>{
    res.end('delelting the leader with id or name as '+req.params.leaderId);
});

module.exports=leaderRouter;