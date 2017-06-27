var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', { title: 'Login' });
	req.session.caranalga = "HEY";
});

/*router.post('/submitLogin', function(req, res, next){
	console.log("entra");
	console.log(req);
});*/

module.exports = router;
