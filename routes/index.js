var express = require('express');
var mongoose = require('mongoose');
var model = require('../models/model');

var User = model.User;
var Article = model.Article;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	Article.find(function(err, doc) {
		res.render('index', { 
			title: '主页' ,
			datas: doc
		});
	});
});

router.get('/reg', function(req, res, next) {
	res.render('register', { title: '注册' });
});

router.post('/reg', function(req, res, next) {
	console.log(req.body);
	var data = new User({
		name: req.body.name,
		password: req.body.password,
		passwordRepeat: req.body.passwordRepeat,
		email: req.body.email
	});

	console.log('---------create---------');
	data.save(function(err, doc) {
		if(err) {
			res.send(err);
		} else {
			res.redirect('/');//跳转
		}
	});
});

router.get('/login', function(req, res, next) {
	User.find(function(err, doc) {
		res.render('login', { 
			title: '登录' ,
			datas: doc
		});
	});
});

router.post('/login', function(req, res, next) {
	var name = req.body.name,
		password = req.body.password;

	User.findOne({name:name}, function(err, user) {
		if(err) {
			console.log("----err: " + err);
			return next(err);
		}
		if(!user) {
			console.log('用户不存在');
			return res.redirect('/login');
		}
		if(user.password !== password) {
			console.log('------user.password: '+ user.password +" + "+ typeof user.password);
			console.log('------password: ' + password +" + "+ typeof password);
			console.log('密码错误');
			return res.redirect('/login');	
		}
		return res.redirect('/');
	});
});

router.get('/post', function(req, res, next) {
	res.render('post', { title: '发表' });
});

router.post('/post', function(req, res, next) {
	var data = new Article({
		title: req.body.title,
		author: req.body.author,
		tag: req.body.tag,
		des: req.body.des,
		content: req.body.content
	});

	data.save(function(err, doc) {
		if(err) {
			res.send(err);
		} else {
			res.redirect('/');
		}
	})
});

router.get('/logout', function(req, res, next) {
});


module.exports = router;
