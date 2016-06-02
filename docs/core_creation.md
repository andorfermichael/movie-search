'Put the movies.json in the right directory'
Go to solr-6.0.0/example and create a new directory movies
Place the movies.json inside this directory

'Stop all instances of solr server'
bin/solr stop -all

'Remove old logs'
rm server/logs/*.log

'Check if old data of a core with the same name exists, if so delete it'
rm -Rf server/solr/movies/

'Start the solr server'
bin/solr start

'Create a core'
bin/solr create -c movies

'Set the schema on a couple of fields that Solr would otherwise guess differently'
curl http://localhost:8983/solr/movies/schema -X POST -H 'Content-type:application/json' --data-binary '{
    "add-field" : {
        "name":"title",
        "type":"text_general",
        "stored":true
    }
}'

'Create an index'
bin/post -c movies example/movies/movies.json

'Add a genre filter'
curl http://localhost:8983/solr/movies/config/params -H 'Content-type:application/json'  -d '{
"update" : {
  "facets": {
    "facet.field":"genre"
    }
  }
}'

'Add highlighting for title'
curl http://localhost:8983/solr/movies/config/params -H 'Content-type:application/json'  -d '{
"set" : {
  "browse": {
    "hl":"on",
    "hl.fl":"title"
    }
  }
}'

Go to http://localhost:8983/solr/movies/browse
