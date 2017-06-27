var ldap = require('ldapjs');

var client = ldap.createClient({
	//url: 'ldap://127.0.0.1:10500/uid='+ username +',ou=system'
	timeout: 30000,
	connectTimeout: 300000,
	url: 'ldap://127.0.0.1:10500/'
});

client.bind('uid=admin,ou=system', 'secret', function (err){
	if (err){
		console.log(err);
	}
});

client.busqueda = function(data){
	var username = data.username;
	var password = data.password;
	var opts = {
		filter: '(cn=nope)',
		scope: 'sub',
		attributes: ['dn', 'sn', 'cn']
	};
	
	//client.bind('uid='+ username +',ou=system', password, function (err) {
	//client.bind('cn='+ username +',ou=users,ou=system', password, function (err) {
	//	if (err){
	//		console.log(err);
	//	} else {
			client.search('ou=system', opts, function(err, res) {
				//assert.ifError(err);
				if (err){
					console.log(err);
				}

				res.on('searchEntry', function(entry) {
					console.log('entry: ' + JSON.stringify(entry.object));
				});
				res.on('searchReference', function(referral) {
					console.log('referral: ' + referral.uris.join());
				});
				res.on('error', function(err) {
					console.error('error: ' + err.message);
				});
				res.on('end', function(result) {
					console.log('status: ' + result.status);
				});
			});
	//	}
	//});
}

client.searchSinBind = function(){
	//var username="admin";
	//var password="secret";
	var opts = {
		filter: '(cn=nope)',
		scope: 'sub',
		attributes: ['dn', 'sn', 'cn']
	};
	client.search('ou=system', opts, function(err, res) {
		//assert.ifError(err);
		if (err){
			console.log(err);
		}

		res.on('searchEntry', function(entry) {
			console.log('entry: ' + JSON.stringify(entry.object));
		});
		res.on('searchReference', function(referral) {
			console.log('referral: ' + referral.uris.join());
		});
		res.on('error', function(err) {
			console.error('error: ' + err.message);
		});
		res.on('end', function(result) {
			console.log('status: ' + result.status);
		});
	});
}

client.userInGroups = function(data, done){
	var username = data;
	var opts = {
		filter: '(&(objectclass=groupOfNames)(member=cn='+ username +',ou=users,ou=system))',
		scope: 'sub',
		attributes: ['dn']
	};
	var groups = [];
	//client.bind('uid=admin,ou=system', 'secret', function (err) {
	//	if (err){
	//		console.log(err);
	//	} else {
			client.search('ou=system', opts, function(err, res) {
				//assert.ifError(err);
				if (err){
					console.log(err);
				}

				res.on('searchEntry', function(entry) {
					var pos = groups.length;
					groups[pos] = entry.object;
				});
				res.on('searchReference', function(referral) {
					console.log('referral: ' + referral.uris.join());
				});
				res.on('error', function(err) {
					console.error('error: ' + err.message);
				});
				res.on('end', function(result) {
					console.log('status: ' + result.status);
					done(groups);
				});
			});
	//	}
	//});
}


function ldapFilterEscape(str) {
    return str.replace(/[*()\\\/]/g, function ($0) {
        return "\\" + $0.charCodeAt(0).toString(16);
    });
}

module.exports = client;