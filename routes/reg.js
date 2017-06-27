var express = require('express');
var router = express.Router();
var utils = require('../config/utils');

/* GET home page. */
router.get('/', utils.requireLogin, function(req, res, next) {
	res.render('reg', { title: 'Regedit check' });
});

module.exports = router;