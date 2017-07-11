var express = require('express');
var sql = require("mssql/msnodesqlv8");
var _const = require('./_const');

var config = {
	driver: 'msnodesqlv8',
	connectionString: _const['mysqlDBConnectionString']
}

// Función que conecta a la BD y ejecuta el comando que se le pase como 1r param
//   IN . query: El comando que se va a ejecutar, formato String
//	 IN . func: Las acciones que se van a ejecutar si la consulta va bien; se definen en la
//				llamada a esta función. 
var executeQuery = function(query, func){
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
}

sql.serverConfig = config;
sql.executeQuery = executeQuery;

module.exports = sql;