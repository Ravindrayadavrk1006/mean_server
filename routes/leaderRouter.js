const express=require('express');
const bodyParser=require('body-parser');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());
//corse module for resource sharing
const cors=require('./cors');
const mongoose=require('mongoose');
const Leader=require('../models/leader');
const authenticate=require('../authenticate');
//defining the working of leader
leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    Leader.find({})
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch(err=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    // res.end('adding a new leader with'+req.body.name+'with the description'+req.body.description);
    Leader.create(req.body)
    .then((leader)=>{
        console.log('promotion created',leader);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch(err=>next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;//not found
    res.end('cant perform '+req.method+'operation on leader');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leader.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp);
    },(err)=>next(err))
    .catch(err=>next(err))
    // res.end('deleting all the leader from the leader page');
});

//LEADER ID
leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    Leader.findById(req.params.leaderId)
    .then(leader=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },err=>next(err))
    .catch(err=>next(err))
    // res.write('Hi There!!!');
    // res.end(`sending all the information of leader with id ${req.params.leaderId}`);
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;//can't perform this opration
    res.end('can\'t perform this operation');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leader.findByIdAndUpdate(req.params.leaderId,{$set:req.body},{new:true})
    .then(leader=>{
        console.log(`${req.params.leaderId} has been updated`);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader)
    },err=>next(err))
    .catch(err=>next(err))
    // res.end(`making changes to ${req.params.leaderId} with the name ${req.body.name} with description ${req.body.description}`);

})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leader.findByIdAndDelete(req.params.leaderId)
    .then(resp=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp)
    },err=>next(err))
    .catch(err=>next(err))
    // res.end('delelting the leader with id or name as '+req.params.leaderId);
});

module.exports=leaderRouter;