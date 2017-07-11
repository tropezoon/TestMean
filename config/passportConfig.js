//var LocalStrategy = require('passport-local').Strategy;
var LdapStrategy = require('passport-ldapauth');
var CasStrategy = require('passport-cas').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var passport = require('passport');
var ldapServer = require('./ldapServer');
var _const = require('./_const');

//Para LDAP
passport.use('ldapauth', new LdapStrategy({
	server: {
		url: _const['ldapServerURL'],
		bindDN: 'uid=admin,ou=system',
		bindCredentials: 'secret',
		searchBase: 'ou=system',
		searchFilter: '(cn={{username}})'
	}
}));

//Para CAS
var cas = new CasStrategy({
		ssoBaseURL: _const['CASServerURL'],
		serverBaseURL: _const['baseURL']
	},
	function(login, done) {
	  User.findOne({login: login}, function (err, user) {
		if (err) {
		  return done(err);
		}
		if (!user) {
		  return done(null, false, {message: 'Unknown user'});
		}
		return done(null, user);
	  })
	});
passport.use('cas', cas);
passport.cas = cas;

//Para JWT
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = _const['tokenSecret'];

passport.use('jwt', new JwtStrategy(opts, function(jwtPayload, done){
	var expirationDate = new Date(jwtPayload.exp * 1000);
	if (expirationDate < new Date()){
		return done(null, false);
	}
	var user = jwtPayload;
	done(null, user);
}));

passport.serializeUser(function(user, done) {
  //done(null, user._id);
  done(null, user.username);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;