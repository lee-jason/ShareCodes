(function(){
	var express = require('express')
	, app = express()
	, path = require('path')
	, bodyParser = require('body-parser')
	, server = require('http').createServer(app)
	, mongoose = require('mongoose')
	, uriUtil = require('mongodb-uri')
	
	var port = process.env.PORT || 5000;
	server.listen(port);
	app.use('/', express.static(path.resolve('./public')));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	
	mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost/quizapp';
	
	var mongooseUri = uriUtil.formatMongoose(mongourl);
	mongoose.connect(mongooseUri);
	
	var EmailSchema = new mongoose.Schema({
		email: {type: String, required: true, unique: true},
		type: {type: String, required: true},
		offer: {type: String},
		region: {type: String},
		timestamp: {type: Number, 'default': Date.now()}
	});
	
	var EmailModel = mongoose.model('Email', EmailSchema);
	
	app.get('/', function(req, res){
		res.sendfile('./index.html');
	});
	app.get('/wantEmails', function(req, res){
		EmailModel.find({type: 'want'}, function(err, email){
			//console.log(email);
			res.json(email);
			//res.json({hurr:'durr'});
		});
	});
	app.get('/haveEmails', function(req, res){
		EmailModel.find({type: 'have'}, function(err, email){
			//console.log(email);
			res.json(email);
			//res.json({hurr:'durr'});
		});
	});
	app.post('/wantEmails', function(req, res){
		var email = new EmailModel({
			email: req.body.email,
			offer: req.body.offer,
			region: req.body.region,
			type: 'want'
		});
		email.save(function(err){
			if(err) console.error(err);
			res.redirect('/');
		});
		
	});
	app.post('/haveEmails', function(req, res){
		var email = new EmailModel({
			email: req.body.email,
			offer: req.body.offer,
			region: req.body.region,
			type: 'have'
		});
		email.save(function(err){
			if(err) console.error(err);
			res.redirect('/');
		});
	});
	
	var pruneOldEmails = function(){
		EmailModel.remove({timestamp: {$lte: Date.now() - 1800000}}, function(err, docs){
			console.log('emails pruned:', docs);
		});
	};
	setInterval(pruneOldEmails, 1800000);
	
})();