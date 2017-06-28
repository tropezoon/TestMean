var utils = {};

// Función que conecta a la BD y ejecuta el comando que se le pase como 1r param
//   IN . query: El comando que se va a ejecutar, formato String
//	 IN . func: Las acciones que se van a ejecutar si la consulta va bien; se definen en la
//				llamada a esta función. 
/*var executeQuery = function(query, func){
	var sql = require("mssql/msnodesqlv8");
	var config = {
		driver: 'msnodesqlv8',
		connectionString: 'Driver={SQL Server Native Client 11.0};Server={P176-11-13\\SQLEXPRESS};Database={testContinental};Trusted_Connection={yes};'
	}
	sql.connect(config, function (err) {
        if (err){ console.log(err);} else 
		
        // create Request object
        var request = new sql.Request();
		 
        // query to the database and get the records
        request.query(query, function (err, recordset) {
            if (err) console.log(err)
			
            //La función que se va a ejecutar tras la consulta
			func(recordset);
			
            sql.close();
        });
    });
}*/

// Función que accede al Registry de Windows para obtener el nombre del usuario 
//	 que ha abierto sesión en la máquina
var getUsernameRegistry = function(done){
	var Registry = require('winreg');
	var regKey = new Registry({
		hive: Registry.HKCU,
		key: "\\Volatile Environment"
	});
	
	var salida = {
		user: null,
		err: null
	}
	
	regKey.values(function(err, items){
		if (err){
			salida.err = err;
			//return salida;
		} else {
			for (var i=0; i<items.length; i++){
				if (items[i].name == "USERNAME"){
					salida.user = items[i].value;
				}
				//console.log('ITEM: '+items[i].name+'\t'+items[i].type+'\t'+items[i].value);
			}
			if (!salida.user){
				salida.err = "No se ha encontrado usuario";
			}
		}
		done(salida);
	});
	
	//return salida;
}

var requireLogin = function(req, res, next){
	if (!req.session.user){
		res.redirect('/login');
	} else {
		next();
	}
}

//utils.executeQuery = executeQuery;
utils.getUsernameRegistry = getUsernameRegistry;
utils.requireLogin = requireLogin

module.exports = utils;