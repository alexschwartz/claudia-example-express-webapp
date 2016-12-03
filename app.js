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

app.get('/rest/api/s3/:bucket', (req, res) => {
    res.send("should serve list of entries in the bucket '" + req.bucket + "' from S3");
})

app.get('/rest/api/s3/:bucket/:filename', (req, res) => {
    serveObjectFromS3({Bucket: req.params.bucket, Key: req.params.filename}, res);
})

app.listen(3000) // <-- comment this line out from your app

module.exports = app // export your app so aws-serverless-express can use it
