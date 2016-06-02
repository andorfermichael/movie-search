var solr = require('solr-client');

var options = {
  host : 'IP or localhost - should be loaded from config file so that it does not appear in Git',
  port : '8983',
  core: 'movies'
}

var client = solr.createClient(options);

// Lucene query
var query2 = client.createQuery()
           .q({title : 'e.g. Hannibal'})
           .start(0)
           .rows(1000);
client.search(query2,function(err,obj){
   if(err){
    console.log(err);
   }else{
    console.log(JSON.stringify(obj));
   }
});
