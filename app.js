'use strict'
const express = require('express')
const app = express()

var AWS = require('aws-sdk');

// GET CSS, js, etc under /assets
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

var aws = require('knox').createClient({
  key: 'image',
  secret: 'my-secret',
  bucket: 'claudia-hello-world-express-20161130'
})

app.get('/rest/api/health/', (req, res) => {
    res.send('alive and kicking\n')
})

function serveObjectFromS3(params, res) {
    console.log("Serving file '" + params.Key + "' from S3 bucket '" + params.Bucket + "'");
    new AWS.S3().getObject(params, function(err, json_data) {
      if (!err) {
        var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
        res.json(json);
      } else {
        res.status(503).send("problem retrieving object from S3 - " + err);
      }
    })
}

app.get('/rest/api/s3/buckets', (req, res) => {
    new AWS.S3().listBuckets(function(err, data) {
      if (!err) {
        res.send(data);
      } else {
        res.status(503).send("problem retrieving object from S3 - " + err);
      } 
    });
});

app.get('/rest/api/s3/buckets/:bucket', (req, res) => {
    res.send("should serve list of entries in the bucket '" + req.bucket + "' from S3");
})

app.get('/rest/api/s3/buckets/:bucket/files/:filename', (req, res) => {
    serveObjectFromS3({Bucket: req.params.bucket, Key: req.params.filename}, res);
})

app.listen(3000) // <-- comment this line out from your app

module.exports = app // export your app so aws-serverless-express can use it
