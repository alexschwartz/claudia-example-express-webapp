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

app.get('/rest/api/simple/', (req, res) => {
    var params = { Bucket: 'claudia-hello-world-express', Key: 'sample.js'}

    new AWS.S3().getObject(params, function(err, json_data) {
      if (!err) {
        var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
        res.json(json);
      } else {
        res.status(503).send("problem retrieving object from S3 - " + err);
      }
    })
})

app.get('/rest/api/hello/', (req, res) => {
    res.sendFile(`${__dirname}/content/hello.json`)
})

app.get('/rest/api/s3/:bucket', (req, res) => {
    res.send("should serve bucket '" + req.bucket + "' from S3");
})

app.listen(3000) // <-- comment this line out from your app

module.exports = app // export your app so aws-serverless-express can use it
