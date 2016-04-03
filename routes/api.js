var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var https = require('https');
var path = require('path');

router.get('/configuration', function(req, res, next) {
    var oJSON = {
		"languages": {
			"sedl-language": "/ideas-sedl-language",
			"iagree-template-language": "/ideas-iagree-template-language",
			"iagree-offer-language": "/ideas-iagree-offer-language",
			"iagree-agreement-language": "/ideas-iagree-agreement-language",
			"ideas-opl-language": "/ideas-opl-language",
			"afm-language": "/ideas-afm-language",
			"fmc-language": "/ideas-fmc-language",
			"hcs-language": "/ideas-hcs-language",
			"needs-language": "/ideas-needs-language",
			"ideas-plaintext-language": "/ideas-plaintext-language",
			"ideas-csv-language": "/ideas-csv-language",
			"ideas-lusdl-language": "/ideas-lusdl-language",
			"ideas-html-language": "/ideas-html-language",
			"ideas-soup-language": "/ideas-soup-language",
			"ideas-json-language": "/ideas-json-language",
			"ideas-yaml-language": "/ideas-yaml-language"
		},
		"images": {
			"logo": "ideas/appLogoBig.png",
			"search": "ideas/Search.png"
		},
		"baseURI": "https://labs.isa.us.es:8181/"
	};

    res.json(oJSON);
});

router.get('/language/:languagePath', function(req, res, next) {
	var options = {
			host: 'labs.isa.us.es',
			port: 8181,
			path: '/' + req.params.languagePath+ "/language",
			method: 'GET',
			rejectUnauthorized: false
		},
		request = https.request(options, function(response) {
			response.on('data', function(d) {
				try {
					var data = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(d)));
					res.json(data);
				} catch (e) {
					console.log(e);
				}
			});
		});

	request.on('error', function(e) {
		console.error(e);
	});

	request.end();
});

router.post('/checklanguage/:language/format/:format', function(req, res, next) {
	var data = querystring.stringify(req.body),
		headers = req.headers,
		options = {
			host: 'labs.isa.us.es',
			port: 8181,
			path: '/' + req.params.language+ "/language/format/" + req.params.format + "/checkLanguage",
			method: 'POST',
			rejectUnauthorized: false,
			headers: headers
		},
		request = https.request(options, function(response) {
			response.on('data', function(d) {
				try {
					var data = JSON.parse(d.toString());
					res.json(data);
				} catch (e) {
					console.log(e);
				}
			});
		});

	request.on('error', function(e) {
		console.error(e);
	});

	request.write(data);
	request.end();
});


router.post('/convert/:language', function(req, res, next) {
	var data = querystring.stringify(req.body),
		options = {
			host: 'labs.isa.us.es',
			port: 8181,
			path: '/' + req.params.language+ "/language/convert",
			method: 'POST',
			rejectUnauthorized: false,
			headers: req.headers
		},
		request = https.request(options, function (response) {
			var result='';

			response.on('data', function (d) {
				result += d.toString();
			});

			response.on('end', function(){
				try {
					var data = JSON.parse(result);
					res.json(data);
				} catch (e) {
					console.error(e);
				}
			});
		});

	request.on('error', function (e) {
		console.error(e);
	});

	request.write(data);
	request.end();
});

router.post('/execute/:language/operation/:operation', function(req, res, next) {
	var data = querystring.stringify(req.body),
		options = {
			host: 'labs.isa.us.es',
			port: 8181,
			path: '/' + req.params.language + '/language/operation/' + req.params.operation + '/execute',
			method: 'POST',
			rejectUnauthorized: false,
			headers: req.headers
		},
		request = https.request(options, function (response) {
			var result='';

			response.on('data', function (d) {
				result += d.toString();
			});

			response.on('end', function(){
				try {
					var data = JSON.parse(result);
					res.json(data);
				} catch (e) {
					console.error(e);
				}
			});
		});

	request.on('error', function (e) {
		console.error(e);
	});

	request.write(data);
	request.end();
});

module.exports = router;
