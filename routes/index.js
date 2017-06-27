var express = require('express');
var router = express.Router();
var utils = require('../config/utils');
var sql = require('../config/mysql');
var ldapServer = require('../config/ldapServer');
var passport = require('../config/passportConfig');

/* GET home page. */
router.get('/', utils.requireLogin, function(req, res, next) {
	console.log(req.session);
	res.render('index', { title: 'Express' });
});

router.get('/prueba', function(req, res) {
	var query = "select * from testTable";
	sql.executeQuery(query, function(result){
		console.log(result);
		res.send(result);
	});
});
router.post('/prueba', function(req, res) {
	var query = "SELECT userId, userName FROM users WHERE userName='"+ req.body.username +"';";
	sql.executeQuery(query, function(result){
		console.log(result.recordset);
		res.send(result.recordset);
	});
});

// LOGIN

router.post('/submitLogin', function(req, res, next){
	res.send(ldapServer.busqueda(req.body));
});
/*router.post('/searchSinBind', function(req, res, next){
	//console.log(req);
	return ldapServer.searchSinBind();
});*/
router.post('/loginConLdap', function(req, res, next){
	passport.authenticate('ldapauth', function(err, user, info){
		if (err){
			return res.send(err);
		}
		if (!user){
			return res.send({ success : false, message : 'authentication failed', info});
		}
		req.session.user = user;
		delete req.session.user.userpassword; //la pass no se guarda
		req.session.save();
		return res.send({ success : true, message : 'authentication succeeded', userData : user});
	})(req, res, next);
});

router.post('/userInGroups', function(req, res, next){
	console.log(req.sessionID);
	ldapServer.userInGroups(req.body.username, function(result){
		res.send(result);
	});
});

//REGEDIT

router.post('/searchRegedit', function(req, res, next){
	
	utils.getUsernameRegistry(function(result){
		res.send(result);
	});
});

module.exports = router;
