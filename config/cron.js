var CronJob = require('cron').CronJob;
var mysql = require('./mysql');

cronSystem = {};
cronSystem.listCrons = [];

//Cada Cron que se cree se ha de añadir a las lista de Crons
cronSystem.listCrons[0] = new CronJob('00 00,30 * * * *', function(){
	var sql = "DELETE FROM sessions WHERE expires < dateadd(HH,-2,getdate())";
	mysql.executeQuery(sql, function(recordset){
		console.log("CRON: Se han eliminado "+ recordset.rowsAffected +" sesiones expiradas de BD");
		console.log("AVISO: Tener en cuenta que la diferencia horaria se ha puesto 'a pelo', para otras zonas horarias, o en cambio de hora, habrá que modificarlo");
	})
});

cronSystem.runAll = function(){
	cronSystem.listCrons.forEach(function(entry){
		entry.start();
	});
}

module.exports = cronSystem;