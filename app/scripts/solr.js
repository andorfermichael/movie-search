/**
 * Created by verakarl on 01/06/16.
 */
var solr = require('solr-client');
var SolrQueryBuilder = require('solr-query-builder');
var qb = new SolrQueryBuilder();

var opt = {
    city: [ 'Florianopolis', 'New York', 'Tokyo' ],
    status: 'open',
    age: 33,
    startDate: '2014-03-22T14:04:48.691Z',
    endDate: '2018-03-22T14:04:48.691Z',
    offset_date: '2015-03-22T14:04:48.691Z',
    offset_id: '507f1f77bcf86cd799439011',
    name: 'Claus'
};

// building the query
if (opt.city) qb.where('city').in(opt.city);
if (opt.status) qb.where('status', opt.status);
if (opt.age) qb.where('age').equals(opt.age);

if (opt.startDate || opt.endDate) {
    qb.where('birthDate').between(opt.startDate, opt.endDate);
}

if (opt.offset_date && opt.offset_id) {
    qb.begin()
        .where('birthDate').lt(opt.offset_date)
        .or()
        .begin()
        .where('birthDate').equals(opt.offset_date)
        .where('_id').lt(opt.offset_id)
        .end()
        .end();
}

if (opt.name) {
    qb.any({
        firstName: opt.name,
        middleName: opt.name,
        lastName: opt.name
    }, { contains: true });
}

// parses the query object to query string
var queryResult = qb.build();


console.log(queryResult);