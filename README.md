# Movie Search

Discover movies and retrieve information about them.

## Development

* `npm install`
* setup [Apache Solr](http://lucene.apache.org/solr/) locally
* create a solr core (see docs folder, CORE_CREATION.md) with the `movies.json` from the data folder
* `grunt`
* change to /app/assets/scripts/node/ and run `node index.js` to start the application

## Production

* `grunt build`
* setup [Node.js](https://nodejs.org/en/) on your server
* setup [Apache Solr](http://lucene.apache.org/solr/) on your server
* create a solr core (see docs folder, CORE_CREATION.md) with the `movies.json` from the data folder
* configure [NGINX](https://www.nginx.com/resources/wiki/) on your server (see docs folder, example.com)
* move the content of dist/ to the application folder in /var/www/
* move the package.json to the application folder and run `npm install`
* change to `/var/www/appfolder/assets/scripts/node/` and run `node index.js` to start the application
* optional but recommended: configure PM2 or a SysVinit script to run the application even when the server restarts due to any reason

## Test

```
npm test
```

## Authors

- [Michael Andorfer](mailto:mandorfer.mmt-b2014@fh-salzburg.ac.at)
- [Nicola Deufemia](mailto:ndeufemia.mmt-b2014@fh-salzburg.ac.at)
- [Vera Karl](mailto:vkarl.mmt-b2014@fh-salzburg.ac.at)
- [Stefanie Habersatter](mailto:shabersatter.mmt-b2014@fh-salzburg.ac.at)

## License

[GNU General Public License, version 3 (GPL-3.0)](https://opensource.org/licenses/GPL-3.0)
