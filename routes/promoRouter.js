const express = require('express');
const bodyParser = require('body-parser');
//corse module for resource sharing
const cors=require('./cors');
const promoRouter = express.Router();
const mongoose=require('mongoose');
const Promotions=require('../models/promotions');
const authenticate=require('../authenticate');
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    // res.end('here is the list of all promos');
    Promotions.find({})
    .then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    },(err)=>next(err))
    .catch(err=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>
{
    // res.end(`adding the new promotion ${req.body.name} with details ${req.body.description}` );
    Promotions.create(req.body)
    .then((promo)=>{
        console.log('promotion created',promo);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch(err=>next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>
{
    res.end('cant perform '+req.method+' on promos');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    // res.end(`deleting the promo page`);
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp);
    },(err)=>next(err))
    .catch(err=>next(err))
})
//for promoId 
promoRouter.route('/:promoId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo)
    },(err)=>next(err))
    // res.statusCode=200;
    // res.setHeader('Content-Type','text/plain');
    // next();
    .catch(err=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>
{
    res.statusCode=403;//not found status 
    res.end(`Can't perform the ${req.method} operation on /promo/${req.params.promoId}`);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId,{$set:req.body},{new:true})
    .then(promo=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },err=>next(err))
    .catch(err=>next(err))
    // req.write('updating the promo/'+req.params.promoId);
    // res.end(`adding the details to`+req.body.name+'with the details '+req.body.description);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findOneAndDelete(req.params.promoId)
    .then(resp=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },err=>next(err))
    .catch(err=>next(err)); 
    // res.end('deleting the promo  with the promoId'+req.params.promoId);
});
module.exports=promoRouter;