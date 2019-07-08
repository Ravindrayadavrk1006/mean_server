const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());
promoRouter.route('/')
.all((req,res,next)=>
{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('here is the list of all promos');
})
.post((req,es,next)=>
{
    res.end(`adding the new promotion ${req.body.name} with details ${req.body.description}` );
})
.put((req,res,next)=>
{
    res.end('cant perform '+req.method+' on promos');
})
.delete((req,res,next)=>{
    res.end(`deleting the promo page`);
})
//for promoId 
promoRouter.route('/:promoId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>
{
    res.end(`sending the promo with promo id =${req.params.promoId}`);
})
.post((req,res,next)=>
{
    res.statusCode=403;//not found status 
    res.end(`Can't perform the ${req.method} operation on /promo/${req.params.promoId}`);
})
.put((req,res,next)=>{
    req.write('updating the promo/'+req.params.promoId);
    res.end(`adding the details to`+req.body.name+'with the details '+req.body.description);
})
.delete((req,res,next)=>{
    res.end('deleting the promo  with the promoId'+req.params.promoId);
});
module.exports=promoRouter;