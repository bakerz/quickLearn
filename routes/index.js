var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');

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
	var name = req.body.name,
		password = req.body.password,
		passwordRepeat = req.body.passwordRepeat;

	//检查两次输入的密码是否一致
	if(password != passwordRepeat) {
		console.log('error', '两次输入的密码不一致！');
		return res.redirect('/reg');
	}

	//检查用户名是否已经存在
	User.findOne({name:name}, function(err, user) {
		if(err) {
			console.log('error', err);
			return res.redirect('/reg');
		}

		if(user) {
			console.log(user);
			console.log('error', '用户名已经存在');
			return res.redirect('/reg');
		}

		//对密码进行md5加密
		var md5 = crypto.createHash('md5'),
			md5password = md5.update(password).digest('hex');

		var newUser = new User({
			name: name,
			password: md5password,
			email: req.body.email
		});

		newUser.save(function(err, doc) {
			if(err) {
				console.log('error', err);
				return res.redirect('/reg');
			}
			console.log('success', '注册成功！');
			newUser.password = null;
			delete newUser.password;
			console.log("+++sessoin.user+++"+req.session.user);
			console.log("---" + newUser);
			req.session.user = newUser;
			console.log("+++" + newUser);
			console.log("+++sessoin.user+++"+req.session.user);
			return res.redirect('/');
		});
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
			req.flash('info', '用户不存在');
			return res.redirect('/login');
		}
		if(user.password !== password) {
			req.flash('error', '密码错误');
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
	res.redirect('/');
});


module.exports = router;
