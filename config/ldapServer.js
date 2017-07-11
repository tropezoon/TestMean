var ldap = require('ldapjs');
var _const = require('./_const');

//Crea una conexión al servidor LDAP ya existente en la URL proporcionada
var client = ldap.createClient({
	timeout: 30000,				//30 segundos
	connectTimeout: 300000,		//5 minutos
	url: _const["ldapServerURL"]
	//url: 'ldap://127.0.0.1:10500/uid='+ username +',ou=system'
});

// Una vez crea la conexión, automáticamente intenta hacer un bind (login interno)
//	con la cuenta del admin (para la mayoría de operaciones se requieren sus permisos)
client.bind('uid=admin,ou=system', 'secret', function (err){
	if (err){
		console.log(err);
	}
});

//*****
//	 FUNCIONES
//			******

// Función que busca si el usuario que recibe de entrada existe en servidor LDAP
//	IN - data [username: el atributo "cn" del usuario a buscar (hacerlo con "uid"?)]
client.busqueda = function(data, next){
	var username = data.username;
	//var password = data.password;
	var opts = {
		filter: '(cn='+ username +')',
		scope: 'sub',
		attributes: ['*']
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
			next(entry.object);
			//console.log('entry: ' + JSON.stringify(entry.object));
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

//	BORRAR ESTA FUNCIÓN
// Función que busca un usuario (lo mismo que la anterior, pero sin bind)
client.searchSinBind = function(){
	var opts = {
		filter: '(cn=nope)',
		scope: 'sub',
		attributes: ['dn', 'sn', 'cn']
	};
	client.search('ou=system', opts, function(err, res) {
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

// Función que busca de qué grupos de LDAP es miembro el usuario buscado
//	IN - data: el atributo "cn" del usuario a buscar (hacerlo con "uid"?)
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
			var pos = groups.length;		//Como el usuario puede estar en más de un grupo, por
			groups[pos] = entry.object;		// cada uno que encuentra guardamos su "dn" en un array
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

//Ni idea qué hace, pero como parece útil la tengo aquí porsiaca
function ldapFilterEscape(str) {
    return str.replace(/[*()\\\/]/g, function ($0) {
        return "\\" + $0.charCodeAt(0).toString(16);
    });
}

module.exports = client;