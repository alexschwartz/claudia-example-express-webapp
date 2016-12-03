'use strict'
const express = require('express')
const app = express()

var AWS = require('aws-sdk');

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

app.get('/assets/:dir/:filename', (req, res) => {
//    console.log('handling ' + req.path + ' by serving a file ');
    res.sendFile(`${__dirname}/` + req.path)
})

app.get('/rest/api/health/', (req, res) => {
    res.send('alive and kicking\n')
})

function serveFromS3(params, res) {
   new AWS.S3().getObject(params, function(err, json_data) {
      if (!err) {
        var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
        res.json(json);
      } else {
        res.status(503).send("problem retrieving object from S3 - " + err);
      }
    })
}

app.get('/rest/api/simple/', (req, res) => {
    var params = { Bucket: 'claudia-hello-world-express', Key: 'sample.js'}
    serveFromS3(params, res);
})

app.get('/rest/api/hello/', (req, res) => {
    res.sendFile(`${__dirname}/content/hello.json`)
})

app.get('/rest/api/s3/:bucket', (req, res) => {
    res.send("should serve list of entries in the bucket '" + req.bucket + "' from S3");
})

app.get('/rest/api/s3/:bucket/:filename', (req, res) => {
    console.log("serving file '" + req.params.filename + "' from the S3 bucket '" + req.params.bucket + "' from");
    var params = { Bucket: req.params.bucket, Key: req.params.filename }
    new AWS.S3().getObject(params, function(err, json_data) {
      if (!err) {
        var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
        res.json(json);
      } else {
        res.status(503).send("problem retrieving object from S3 - " + err);
      }
    })
})

app.listen(3000) // <-- comment this line out from your app

module.exports = app // export your app so aws-serverless-express can use it
