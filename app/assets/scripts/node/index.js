const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 5000

app.use(express.static('../../../../dist'));

http.listen(port, function(){
	console.log(`webserver listening on *:${port}`)
})

io.on('connection', function(socket){
	socket.on('searchValue', function(value) {

		var solr = require('solr-client');

		var options = {
			host : 'localhost',
			port : '8983',
			core: 'movies'
		}

		var client = solr.createClient(options);

// Lucene query
		var query2 = client.createQuery()
			.q({title : value})
			.start(0)
			.rows(1000);
		client.search(query2,function(err,obj){
			if(err){
				console.log(err);
			}else{
				console.log(JSON.stringify(obj));
			}
		});
	})
})

exports = module.exports = app
