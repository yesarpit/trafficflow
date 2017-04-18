var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');



var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})




var MongoClient = require('mongodb').MongoClient


// Connection URL
//var url = 'mongodb://localhost:27017/Traffic';
var url = 'mongodb://127.3.177.130:27017/trafficflow';
// Use connect method to connect to the server


var dbo,
    allItems = [];


MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    dbo = db;

});



app.get('/listEntries', function(req, res) {
    console.log('listing now');
    findEntries(dbo, function() {
        res.json(allItems);
    });



})


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/postEntry', upload.array(), function(req, res) {
    console.log(req.body);
    insertDocument(dbo, req.body, function() {
        res.json(req.body);
    })



})


var insertDocument = function(db, payload, callback) {
    var payloadWithTimeStamp = Object.assign({ timestamp: new Date().toLocaleString() }, payload)
    db.collection('entries').insertOne(payloadWithTimeStamp, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the entries collection.");
        callback();
    });
};


var findEntries = function(db, callback) {
    allItems = []
    var cursor = db.collection('entries').find();
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            allItems.push(doc);
        } else {
            callback();
        }
    });
};
