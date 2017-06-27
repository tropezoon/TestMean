//var LocalStrategy = require('passport-local').Strategy;
var LdapStrategy = require('passport-ldapauth');
var passport = require('passport');
var ldapServer = require('./ldapServer');

passport.use('ldapauth', new LdapStrategy({
	server: {
		url: 'ldap://127.0.0.1:10500',
		bindDN: 'uid=admin,ou=system',
		bindCredentials: 'secret',
		searchBase: 'ou=system',
		searchFilter: '(cn={{username}})'
	}
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;