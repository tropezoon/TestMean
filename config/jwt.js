var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var randtoken = require('rand-token');
var _const = require('./_const');

var tokenSystem = {}
tokenSystem.refreshTokens = {}

var getAllTokens = function(next){
	next(tokenSystem.refreshTokens);
}

var createToken = function(req, next){
	var username = req.body.username;
	//var password = req.body.password;
	var now = new Date();
	var user = { 
		'sub': username,
		'iat': Math.floor(now.getTime() / 1000),
		'exp': Math.floor((now.getTime() / 1000) + (1*60))
		//'role': 'admin' 
	}
	var token = jwt.sign(user, _const['tokenSecret']) 
	var refreshToken = randtoken.uid(256) 
	tokenSystem.refreshTokens[refreshToken] = username; //res.json({token: 'JWT ' + token, refreshToken: refreshToken})
	next(token, refreshToken);
}

var createToken_v2 = function(userDN){
	var now = new Date();
	var user = { 
		'sub': userDN,
		'iat': Math.floor(now.getTime() / 1000),
		'exp': Math.floor((now.getTime() / 1000) + (1*60))
		//'role': 'admin' 
	}
	return jwt.sign(user, _const['tokenSecret']);
}

var deleteToken = function(token, next){
	if (token in tokenSystem.refreshTokens){
		delete tokenSystem.refreshTokens[token];
	}
	next();
}

var ensureAuthenticated = function(req, res, next){
	//console.log(req.headers);
	if(!req.headers.authorization) {
		return res
			.status(403)
			.send({message: "Tu petición no tiene cabecera de autorización"});
	}

	var token = req.headers.authorization.split(" ")[1];
	var payload = jwt.verify(token, _const['tokenSecret']);

	if(payload.exp <= Math.floor(new Date().getTime() / 1000)) {
		return res
			.status(401)
			.send({message: "El token ha expirado"});
	}

	req.user = payload.sub;
	next();
}

tokenSystem.getAllTokens = getAllTokens;
tokenSystem.createToken = createToken;
tokenSystem.createToken_v2 = createToken_v2;
tokenSystem.deleteToken = deleteToken;
tokenSystem.ensureAuthenticated = ensureAuthenticated;

module.exports = tokenSystem;