var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken') 
var randtoken = require('rand-token') 

var tokenSystem = {}
tokenSystem.refreshTokens = {}
var SECRET = "inyoureyes";

var getAllTokens = function(next){
	next(tokenSystem.refreshTokens);
}

var createToken = function(req, next){
	var username = req.body.username;
	var password = req.body.password;
	var user = { 
		'username': username, 
		'role': 'admin' 
	} 
	var token = jwt.sign(user, SECRET, { expiresIn: 300 }) 
	var refreshToken = randtoken.uid(256) 
	tokenSystem.refreshTokens[refreshToken] = username; //res.json({token: 'JWT ' + token, refreshToken: refreshToken})
	next(token, refreshToken);
}

var deleteToken = function(token, next){
	if (token in tokenSystem.refreshTokens){
		delete tokenSystem.refreshTokens[token];
	}
	next();
}

tokenSystem.getAllTokens = getAllTokens;
tokenSystem.createToken = createToken;
tokenSystem.deleteToken = deleteToken;

module.exports = tokenSystem;