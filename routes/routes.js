var express = require('express');
var router = express.Router();
var utils = require('../config/utils');
var sql = require('../config/mysql');
var ldapServer = require('../config/ldapServer');
var passport = require('../config/passportConfig');
var jwt = require('../config/jwt');

//********
//	  INICIO
//		********
router.get('/'/*, utils.requireLogin*/, function(req, res, next) {
	//console.log(req.session);
	res.render('index', { title: 'Express' });
});

router.get('/prueba', function(req, res) {
	var query = "select * from testTable";
	sql.executeQuery(query, function(result){
		//console.log(result);
		res.send(result);
	});
	/*var uuid = require('uuid-by-string');
	console.log(uuid("test"));
	res.sendStatus(200);*/
});
router.post('/prueba', function(req, res) {
	//req.body.username = "hey";
	jwt.createToken(req, function(token, refreshToken){
		//console.log(token +" | "+ refreshToken);
		res.json({token: 'JWT ' + token, refreshToken: refreshToken});
	});
	/*var query = "SELECT userId, userName FROM users WHERE userName='"+ req.body.username +"';";
	sql.executeQuery(query, function(result){
		console.log(result.recordset);
		res.send(result.recordset);
	});*/
	
});

//********
//	  LOGIN
//		********

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Login' });
});

router.post('/submitLogin', jwt.ensureAuthenticated, function(req, res, next){
	ldapServer.busqueda(req.body, function(entry){
		res.status(200).send(entry);
	});
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
		delete req.session.user.userPassword; //la pass no se guarda
		req.session.save();
		return res.send({ success : true, message : 'authentication succeeded', userData : req.session.user, sessionID: req.sessionID});
	})(req, res, next);
});

router.post('/loginLdapToken', function(req, res, next){
	passport.authenticate('ldapauth', function(err, user, info){
		if (err){
			return res.send(err);
		}
		if (!user){
			return res.send({ success : false, message : 'authentication failed', info});
		}
		var token = jwt.createToken_v2(user.dn);
		return res.send({ 
			success : true, 
			message : 'authentication succeeded', 
			userData : user, 
			token: token});
	})(req, res, next);
});

router.post('/userInGroups', function(req, res, next){
	console.log(req.sessionID);
	ldapServer.userInGroups(req.body.username, function(result){
		res.send(result);
	});
});

//********
//	  REGEDIT
//		 ********

router.get('/reged', utils.requireLogin, function(req, res, next) {
	console.log(req.session);
	res.render('reg', { title: 'Regedit check' });
});

router.post('/searchRegedit', function(req, res, next){
	utils.getUsernameRegistry(function(result){
		res.send(result);
	});
});

//********
//	  JWT
//		********

router.get('/jwt', 
			/*passport.authenticate('jwt'),*/
			/*passport.authenticate('cas', {failureRedirect: '/login'}),
			function(req, res, next) {
	res.render('jwt', { title: 'Tokens' });*/
			function(req, res, next){
				
	passport.authenticate('cas', function (err, user, info) {
		console.log("### ERR ###", err);
		console.log("### USER ###", user);
		console.log("### INFO ###", info)
		if (err) {
			console.log("error general");
		  return next(err);
		}

		if (!user) {
			console.log("error no user");
		  req.session.messages = info.message;
		  return res.redirect('/');
		}

		req.logIn(user, function (err) {
		  if (err) {
			  console.log("error login general");
			return next(err);
		  }

		  req.session.messages = '';
		  res.render('jwt', { title: 'Tokens' });
		});
	  })(req, res, next);
});

router.get('/token/getAll', function(req, res, next){
	jwt.getAllTokens(function(tokens){
		res.send(tokens);
	})
});

router.post('/token/reject', function(req, res, next){
	jwt.deleteToken(req.body.refreshToken, function(){
		res.sendStatus(204);
	});
});

// ENLACE PARA PROBAR EL TOKEN (SIN TOKEN NO ENTRAS)
//router.get('/test_entro', passport.authenticate('jwt'), function(req, res, next) {
router.get('/test_entro', jwt.ensureAuthenticated, function(req, res, next) {
	res.render('test_entro', {title: 'Entro'});
});

//CAS Logiout
router.get('/casLogout', function(req, res, next) {
	var returnURL = '/login';
    passport.cas.logout(req, res, returnURL);
});

module.exports = router;