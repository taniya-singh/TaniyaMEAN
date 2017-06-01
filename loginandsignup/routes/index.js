import express from 'express';
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import passport from 'passport';
import passportLocal from 'passport-local';
import fs from 'fs';
import multer from 'multer';

var LocalStrategy = passportLocal.Strategy;

const router = express.Router();

/* GET index page. */

mongoose.connect("mongodb://localhost/register",function(error)
{
	if(error)
	{
		console.log("error");
	}
	else
	{
		console.log("connected to database register");
	}	
});


var Schema=mongoose.Schema;

var userschema=new Schema({
	name:String,
	email:String,
	fullname:String,
	password:String,
	dob:String,
	contactno:Number,
	gender:String,
	active: {
    type: Boolean,
    default: false 
  },
});

var prodschema=new Schema({
	prod_name:String,
	prod_price:Number,
	prod_category:String,
	prod_date:String
});
 var User=mongoose.model('User',userschema,'signup');
 var prod=mongoose.model('product',prodschema,'product');


router.get('/', (req, res) => {
  console.log("homepage");

});


router.get('/signup',(req,res)=>{
	console.log("signup");
	/*res.send('signup');*/
});

router.post ("/signup", function (req, res)
	 {

	 	var newuser = new User;
	 	var user_name=req.body.name;
	 	var user_gender=req.body.gender;
	 	var user_email=req.body.email;
	 	var user_password=req.body.password;
	 	var user_dob=req.body.dob;
	 	var user_country=req.body.country;
	 	var user_contactno=req.body.contactno;
	 	newuser.password=user_password;
	 	newuser.email=user_email;
	 	newuser.gender=user_gender;
	 	newuser.name=user_name;
	 	newuser.dob=user_dob;
	 	newuser.country=user_country;
	 	newuser.contactno=user_contactno;
	 	

	 	User.find({name:req.body.name},function(err,use)
	 	{
	 		if(err)
	 		{
	 			res.json({message:"errro occured"})

	 		}
	 		else
	 		{
	 			if(use!="")
	 			{
	 				res.json({status:false,message:"user already registered"});
	 			}
	 			else
	 			{
	 				newuser.save(function(err,docs)
	 				{
	 					if(err)
	 					res.send({err:"not send"})
	 					else
	 					{
		 					
		 					//console.log("successss",docs);
		 					res.json({status:true,message:"Registered Successfully"})
							
	 					}
	 				})
	 			}	


	 		}
	 	});

	 })


passport.use("local",new LocalStrategy({

  // by default, local strategy uses username and password, we will override with name
  usernameField: 'username',
  passwordField: 'password'
  //passReqToCallback: true
	},
	 
  function(username, password, done) 
  {
  	//console.log("here in local", username);
    User.findOne({ email: username}, function(err, user) 
    {
    	console.log("email ",user);

      if (err)
      { 
      	return done(err); 
      }
      if (!user) 
      {
      	console.log("name ",username);
        return done(null, false, { message: 'Incorrect email.'});
      }
      if (user.password != password)
      {
      	console.log("password ",password);
        return done(null, false, { message: 'Incorrect password.'});
      }
      //console.log("here in passpportttttttttttt",user);
      return done(null, user);
    });
  }
));



passport.serializeUser(function(user, done) {
	console.log("helllo in searilize");

  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
    console.log("helllo in desearilize");
  });
});

router.get('/page1',function()
{
	console.log(" get in page1");
})

router.post('/page1',function()
{
	console.log(" post in page1");
})

router.post('/login', function(req,res,next)
{
	/*console.log("req", req.body);*/

	passport.authenticate('local',function(err,userr,info){
		/*console.log("ahaehaeta",user.email)
		console.log("gragagagasgasg",user.password);*/

		if(err)
		{
			return next(err);
		}
		else if("kamal@gmail.com"==userr.email && "123"==userr.password)
		{
			//console.log("hello your are here taniya singh")
			return res.send({success:true,message:"login as admin"})
		}
		else if(!userr)
		{
			//var lol=info.alert;
			return res.send({success:false,message:"invalid email"})
		}
		else
		{
			console.log("aAAAAAAAAAAAAAAAAASG",userr)
			return res.send({success:true,message:"user loged in"})
		}
	})(req,res,next);
	
})
router.post("/logout",function(req,res)
{

	console.log("aegrag",req.session.passport.userr);
	//console.log("hello here in logout");
	res.send({success:true,message:" taniya singh"})
})


router.get('/login',function(req,res)
{
	//res.render('index.html',{})
})

 router.get('/profile',function(req,res)
 {
 	
 	console.log("session name is  -----",req.session.passport.user)
 	console.log("here in get");

 })
router.post('/profile',function(req,res)
{
	console.log("session name is  -----",req.session.passport.user)
	console.log("here in post ");
})
router.get('/admin',function(req,res)
{
console.log("in get sessiom",req.passport.session.user);
})
router.post('/admin',function(req,res)
{
console.log("in post sessiom",req.passport.session.user);
})


 router.post('/getuser',function(req,res)
 {
		var page = req.body.page || 1,
    	count = req.body.count || 50;
    	var skipNo = (page - 1) * count;
    	
    	if(req.body.status == 'active'){
    	query.active = true
 		 }
  		else if(req.body.status == 'inactive' ){
   		 query.active = false
  			}
  
  		User.count({},function(err, total) {
	    	if (err) 
	    	{
	        	res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
	    	} 
	    	else 
	    	{
	      		User.find({},{},{skip:skipNo,limit:count},function(err, users) {
		        	if (err) {
		         		res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
		        	} 
		        	else{
		        		res.send({"message": "success", "data": users,"total": total, "status_code": "200"});
		        	}
	    		})
	    	}
 		});
 });

 router.post('/updatestatus',function(req, res) {
  console.log("hello in update status index.js")
  var update = {};
  var data = req.body;
  update.active = (data.active) ? false : true;
  console.log("update.active", update.active);
  User.update({
    _id: data._id
  }, update).exec(function(error, users) {
    if (error) {
      res.send({
        "message": "Something went wrong!",
        "err": err,
        "status_code": "500"
      });
    } else {
      res.send({
        "message": "success",
        "data": users,
        "status_code": "200"
      });
    }
  })
});

router.post('/enableemployees',function(req, res) {
	console.log("hello in enable employee")
	console.log(req.body);
  var enabled = req.body.enabled;
  var selAll = req.body.allChecked;
  var query = {};
  var fields = {};
  query._id = {
      $in: req.body.employee
  };
  console.log("query_id",query._id)

  if (enabled == true) {
      fields.active = true;
  } else {
      fields.active = false;
  }
  console.log("anabel",enabled)
  User.update(query, fields, {multi: true},function(error, users) {
  		console.log("inside")
    	if (error) {
	      	res.send({
	        	"message": "Something went wrong!",
	        	"err": err,
	        	"status_code": "500"
	        	});
    	}
    	User.find({roles: {$in:["employee"]},is_deleted:false}, function(err, users) {
        	if (error) {
	          res.send({
	            "message": "Something went wrong!",
	            "err": err,
	            "status_code": "500"
	          });
	        } 
	        else {
	          res.send({
	            "message": "success",
	            "data": users,
	            "status_code": "200"
	          });
        	}
      	})
  })
})
router.post("/bulkaction",function(req,res){
  
  	User.find({_id:{$in:req.body}},function(err,users)
  	{
  		if(err)
  		{
  			console.log("errrrrrr");

  		}
  		else
  			{
            var bufferLength = users.length;
            console.log("bufferLength",bufferLength);
            var bulk = User.collection.initializeUnorderedBulkOp();
      
            	for(var i = 0; i< bufferLength; i++)
            	{
                    var bufferData = users[i];
                    var id=bufferData._id;
                    bulk.find({'_id':id}).update({$set:{active:true}});
                }
                bulk.execute(function (data) {
              		res.json({'status': 'success', 'messageId':200, 'message':'successfully'})
            	});
            
  			}
  	})
})
 


 router.post("/deleteuser",function(req,res)
{
	console.log("prrrrrrr to delete is ",req.body.email);

	var flag=0;
	User.findOneAndRemove({email:req.body.email},function(err,docs)
	{
		//console.log("here is meee",docs);
		if(docs==null)
		{
			res.json({status:false,message:"not removed"})
				
		}
		else
		{
			res.json({status:true,message:"User deleted successfully"})
				
		}
		
	})
	

});



 router.post("/updateuser",function(req,res)
{

			User.update({email:req.body.email},{$set:{name:req.body.name}},{multi:true},function(err,docss)
				{
					if(err)
					{
					res.send({err:"not updated"})
					}
					else
					{

						console.log("docss is",docss)
						res.json({success:true,message:"record updated"});
					}
				
				})
			//}
		//}
	})

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },

        filename: function (req, file, cb) {
            //var datetimestamp = Date.now();
            var filename = "tannn";
            cb(null,''+ filename);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');
   
    /** API path that will upload the files */
   

    router.post('/image', function(req, res) {
    	
    	{
    		console.log("hi in image")
    	
	        upload(req,res,function(err){
	            if(err){
	                 res.json({error_code:1,err_desc:err});
	                 console.log("errror occured in image")
	                 return;
	            }
	             res.json({status: 'success', message: 'Image uploaded'});
	        })
    	}
    	
    });

    router.get ('/getimage', (req, res) => {
    	var filename = "taniya";

    	var image = fs.readFileSync ('https://localhost:3000/uploads/'+ filename);
    	console.log("hello here");

    	res.writeHead (200, {'Content-Type': 'image/jpeg'});
    	res.end (image, 'binary');
    })


export default router;
