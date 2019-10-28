const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const Dishes=require('../models/dishes');
const authenticate=require('../authenticate');
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

.get((req,res,next) => {
   Dishes.find({})
   .populate('comments.author')
   .then((dishes)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(dishes);

   },(err)=>next(err))
   .catch((err)=>next(err));
})
//authenticating for the user
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.create(req.body)
    .then((dish)=>{
        console.log("dish created",dish);
        res.statusCode=200;
         res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});



dishRouter.route('/:dishId')
//<<FOR '/dishes/:dishId>>>
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId  )
    .populate('comments.author')
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err))    
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;//operation not supported
    res.end(`POST method not supported on /dishes/${req.params.dishId}`); 
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body},
        {new:true})
        .then((dish)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(dish);
        },(err)=>next(err))
        .catch((err)=>next(err))   
    // //here comes the use of bodyParser since it parse the incoming request information generally POST and PUT
    // res.write('will update the dish with dishID =>'+req.params.dishId+'\n');
    // //body-parsing the infromation from req.body part
    // res.end('updating the dish name =>'+req.body.name+'with details =>'+req.body.description);
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err)) 
    // res.end('DELETING   the dishe! =>'+req.params.dishId);
});
//handling some remaining part part 3







dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
   Dishes.findById(req.params.dishId)
   .populate('comments.author')
   .then((dish)=>{
       if(dish!=null)
       {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish.comments);
       }
       else
       {
           err=new Error('Dish'+req.params.dishId+'not found');
           err.statusCode=404;
           return next(err);
       }
   },(err)=>next(err))
   .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null)
       {
           req.body.author=req.user._id   //the userid will be fetched from the authenticationpart
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                        
                })
                

        },(err)=>next(err))
        
       }
       else
       {
           err=new Error('Dish'+req.params.dishId+'not found');
           err.statusCode=404;
           return next(err);
       }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes'+req.params.dishId+'/comments');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((resp)=>{
        if(dish!=null)
       {
           for(let i=(dish.comments.length-1);i>=0;i--)
           {
               dish.comments.id(dish.comments[i]._id).remove();
           }
           dish.save()
           .then((dish)=>{
               res.statusCode=200;
               res.setHeader('Content-Type','application/json');
               res.json(dish);
   
           },(err)=>next(err))

       }
       else
       {
           err=new Error('Dish'+req.params.dishId+'not found');
           err.statusCode=404;
           return next(err);
       }
    },(err)=>next(err))
    .catch((err)=>next(err))
});



dishRouter.route('/:dishId/comments/:commentId')
//<<FOR '/dishes/:dishId>>>
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId  )
    .populate('comments.author')
    .then((dish)=>{
        //dish and comments both exists
        if(dish!=null && dish.comments.id(req.params.commentId)!=null)
        {
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(dish.comments.id(req.params.commentId));
        }
        else if(dish==null)
        {
            err=new Error('Dish'+req.params.dishId+'not found');
            err.statusCode=404;
            return next(err);
        }
        else{
            err=new Error('Comment'+req.params.commentId+'not found');
            err.statusCode=404;
            return next(err);
        }
        
    },(err)=>next(err))
    .catch((err)=>next(err))    
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;//operation not supported
    res.end(`POST method not supported on /dishes/${req.params.dishId} /comments/ ${req.params.commentId}`); 
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId  )
    .then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentId)!=null && dish.comments.id(req.params.commentId).author.equals(req.user._id))
        {
            if(req.body.rating)
            {
                dish.comments.id(req.params.commentId).rating=req.body.rating
            }
            if(req.body.comment)
            {
                dish.comments.id(req.params.commentId).comment=req.body.comment;
            }
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then(dish=>{
                     res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                })
            },(err)=>next(err))
        }
        else if(dish==null)
        {
            err=new Error('Dish'+req.params.dishId+'not found');
            err.statusCode=404;
            return next(err);
        }
        else{
            err=new Error('Comment'+req.params.commentId+'not found');
            err.statusCode=404;
            return next(err);
        }
        
    },(err)=>next(err))
        .catch((err)=>next(err))   
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentId)!=null && dish.comments.id(req.params.commentId).author.equals(req.user._id))
       {
            dish.comments.id(req.params.commentId).remove();   
            dish.save()
           .then((dish)=>{
               Dishes.findById(dish._id)
                .populate('comments.author')
                .then(dish=>{
                     res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                })
           },(err)=>next(err))
       }
       else if(dish==null)
       {
           err=new  Error('Dish'+req.params.dishId+'not found');
           err.statusCode=404;
           return next(err);
       }
       else{
           err=new Error('Comment'+req.params.commentId+'not found');
           err.statusCode=404;
           return next(err);
       }
       
   },(err)=>next(err))
       .catch((err)=>next(err))   
      

});
module.exports = dishRouter;