const express = require('express');
const app = express();
const http = require('http').Server(app);
var solr = require('solr-client');
const port = process.env.PORT || 5000;
const io = require('node_modules/socket.io')(http);

var options = {
	host : 'localhost',
	port : '8983',
	core: 'movies'
};

var client = solr.createClient(options);

app.use(express.static('dist'));

http.listen(port, function(){
	console.log('listening');
});

// Lucene query
function searchByValue() {
	var query = client.createQuery()
		.q({title: 'Batman'})
		.start(0)
		.rows(1000);
	client.search(query, function (err, obj) {
		if (err) {
			console.log(err);
		} else {
			console.log(JSON.stringify(obj));
		}
	});
}
exports = module.exports = app;






