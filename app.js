const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// initialize your express with app as a variable
const app = express();

//setting your view engine
app.set('view engine', 'ejs');

//setting your body parser
app.use(bodyParser.urlencoded({extended:true}));

//setting up your static files 
app.use(express.static('./public'));


//set or create a storage engine
const storage = multer.diskStorage({
destination:'./public/uploads/',
filename: function(req, file, cb){
	cb(null, file.fieldname+"-"+Date.now()+path.extname(file.originalname));
}
});

//initialize uploads
const upload = multer({
storage : storage,
limits: {fileSize: 3000000},
fileFilter : function(req, file, cb){
checkFileType(file, cb)
}
}).single('myImage');

function checkFileType(file, cb){
	const filetypes = /jpg|jpeg|gif|png/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);
	if(extname && mimetype){
		return cb(null, true);
		
	} else{
		 cb('ERROR: images only!!!');
	}
}
//check file type
//lets serve something to the page
app.get('/',  function(req, res){
	res.render("index");
});
app.post('/store', (req, res)=>{
	upload(req, res, (err)=>{
		if(err){
			res.render('index', {
				msg:err
			});
		}else{
			
		if(req.file==undefined){
				res.render('index', {
				msg : 'upload a file!!!'
				});
		}else{

				console.log(req.file.filename);
				res.render('index', {
					msg: 'File Uploaded successfully',
					file: 'uploads/'+req.file.filename
				});
			}
		}
	});
});

//listening to a port 
const port = 3000; 
app.listen(port, function(err){
if(err) throw err;
console.log('you are currently listening to port '+port);
});